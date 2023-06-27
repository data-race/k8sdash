package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"sync"
	"time"

	"github.com/data-race/k8sdash-back/config"
	"github.com/data-race/k8sdash-back/log"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/kr/pty"
	"go.uber.org/zap"
)

// Refer: https://github.com/zephinzer/cloudshell

func getConnectionUpgrader(
	allowedHostnames []string,
	maxBufferSizeBytes int,
	logger *zap.Logger,
) websocket.Upgrader {
	return websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			requesterHostname := r.Host
			if strings.Contains(requesterHostname, ":") {
				requesterHostname = strings.Split(requesterHostname, ":")[0]
			}
			for _, allowedHostname := range allowedHostnames {
				if requesterHostname == allowedHostname {
					return true
				}
			}
			logger.Warn(fmt.Sprintf("failed to find '%s' in the list of allowed hostnames ('%s')", requesterHostname, config.Conf.AllowedHostNames))
			return false
		},
		HandshakeTimeout: 0,
		ReadBufferSize:   maxBufferSizeBytes,
		WriteBufferSize:  maxBufferSizeBytes,
	}
}

var WebsocketMessageType = map[int]string{
	websocket.BinaryMessage: "binary",
	websocket.TextMessage:   "text",
	websocket.CloseMessage:  "close",
	websocket.PingMessage:   "ping",
	websocket.PongMessage:   "pong",
}

// TTYSize represents a JSON structure to be sent by the frontend
// xterm.js implementation to the xterm.js websocket handler
type TTYSize struct {
	Cols uint16 `json:"cols"`
	Rows uint16 `json:"rows"`
	X    uint16 `json:"x"`
	Y    uint16 `json:"y"`
}

func TermHandler(c *gin.Context) {
	connectionErrorLimit := config.Conf.ConnectionErrorLimit
	maxBufferSizeBytes := config.Conf.TermBufferSize
	connectionUUID, err := uuid.NewUUID()
	logger := log.GetLogger().With(zap.String("term-uuid", connectionUUID.String()))
	if err != nil {
		message := "failed to get a connection uuid"
		logger.Error(fmt.Sprintf("%s: %s", message, err))
		c.String(http.StatusInternalServerError, message)

	}
	logger.Info("established connection identity")

	allowedHostnames := config.Conf.AllowedHostNames
	upgrader := getConnectionUpgrader(allowedHostnames, maxBufferSizeBytes, logger)
	connection, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		logger.Warn(fmt.Sprintf("failed to upgrade connection: %s", err))
		return
	}

	terminal := config.Conf.Command
	args := config.Conf.Args
	logger.Debug(fmt.Sprintf("starting new tty using command '%s' with arguments ['%s']...", terminal, strings.Join(args, "', '")))
	cmd := exec.Command(terminal, args...)
	cmd.Env = os.Environ()
	tty, err := pty.Start(cmd)
	if err != nil {
		message := fmt.Sprintf("failed to start tty: %s", err)
		logger.Warn(message)
		_ = connection.WriteMessage(websocket.TextMessage, []byte(message))
		return
	}
	defer func() {
		logger.Info("gracefully stopping spawned tty...")
		if err := cmd.Process.Kill(); err != nil {
			logger.Warn(fmt.Sprintf("failed to kill process: %s", err))
		}
		if _, err := cmd.Process.Wait(); err != nil {
			logger.Warn(fmt.Sprintf("failed to wait for process to exit: %s", err))
		}
		if err := tty.Close(); err != nil {
			logger.Warn(fmt.Sprintf("failed to close spawned tty gracefully: %s", err))
		}
		if err := connection.Close(); err != nil {
			logger.Warn(fmt.Sprintf("failed to close webscoket connection: %s", err))
		}
	}()

	var connectionClosed bool
	var waiter sync.WaitGroup
	waiter.Add(2)

	// this is a keep-alive loop that ensures connection does not hang-up itself
	lastPongTime := time.Now()
	connection.SetPongHandler(func(msg string) error {
		lastPongTime = time.Now()
		return nil
	})
	go func() {
		for {
			if err := connection.WriteMessage(websocket.PingMessage, []byte("keepalive")); err != nil {
				logger.Warn("failed to write ping message")
				return
			}
			time.Sleep(config.Conf.KeepAlivePingTimeout)
			if time.Since(lastPongTime) > config.Conf.KeepAlivePingTimeout {
				logger.Warn("failed to get response from ping, triggering disconnect now...")
				waiter.Done()
				return
			}
			logger.Debug("received response from ping successfully")
		}
	}()

	// tty >> xterm.js
	go func() {
		errorCounter := 0
		for {
			// consider the connection closed/errored out so that the socket handler
			// can be terminated - this frees up memory so the service doesn't get
			// overloaded
			if errorCounter > connectionErrorLimit {
				waiter.Done()
				break
			}
			buffer := make([]byte, maxBufferSizeBytes)
			readLength, err := tty.Read(buffer)
			if err != nil {
				logger.Warn(fmt.Sprintf("failed to read from tty: %s", err))
				if err := connection.WriteMessage(websocket.TextMessage, []byte("bye!")); err != nil {
					logger.Warn(fmt.Sprintf("failed to send termination message from tty to xterm.js: %s", err))
				}
				waiter.Done()
				return
			}
			if err := connection.WriteMessage(websocket.BinaryMessage, buffer[:readLength]); err != nil {
				logger.Warn(fmt.Sprintf("failed to send %v bytes from tty to xterm.js", readLength))
				errorCounter++
				continue
			}
			logger.Debug(fmt.Sprintf("sent message of size %v bytes from tty to xterm.js", readLength))
			errorCounter = 0
		}
	}()

	// tty << xterm.js
	go func() {
		for {
			// data processing
			messageType, data, err := connection.ReadMessage()
			if err != nil {
				if !connectionClosed {
					logger.Warn(fmt.Sprintf("failed to get next reader: %s", err))
				}
				return
			}
			dataLength := len(data)
			dataBuffer := bytes.Trim(data, "\x00")
			dataType, ok := WebsocketMessageType[messageType]
			if !ok {
				dataType = "uunknown"
			}
			logger.Info(fmt.Sprintf("received %s (type: %v) message of size %v byte(s) from xterm.js with key sequence: %v", dataType, messageType, dataLength, dataBuffer))

			// process
			if dataLength == -1 { // invalid
				logger.Warn("failed to get the correct number of bytes read, ignoring message")
				continue
			}

			// handle resizing
			if messageType == websocket.BinaryMessage {
				if dataBuffer[0] == 1 {
					ttySize := &TTYSize{}
					resizeMessage := bytes.Trim(dataBuffer[1:], " \n\r\t\x00\x01")
					if err := json.Unmarshal(resizeMessage, ttySize); err != nil {
						logger.Warn(fmt.Sprintf("failed to unmarshal received resize message '%s': %s", string(resizeMessage), err))
						continue
					}
					logger.Info(fmt.Sprintf("resizing tty to use %v rows and %v columns...", ttySize.Rows, ttySize.Cols))
					if err := pty.Setsize(tty, &pty.Winsize{
						Rows: ttySize.Rows,
						Cols: ttySize.Cols,
					}); err != nil {
						logger.Warn(fmt.Sprintf("failed to resize tty, error: %s", err))
					}
					continue
				}
			}

			// write to tty
			bytesWritten, err := tty.Write(dataBuffer)
			if err != nil {
				logger.Warn(fmt.Sprintf("failed to write %v bytes to tty: %s", len(dataBuffer), err))
				continue
			}
			logger.Debug(fmt.Sprintf("%v bytes written to tty...", bytesWritten))
		}
	}()

	waiter.Wait()
	logger.Info("closing connection...")
	connectionClosed = true
}
