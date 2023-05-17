import { CSSProperties, useEffect } from "react";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import "xterm/css/xterm.css";

// Refer: https://juejin.cn/post/6918911964009725959

interface WebTerminalProps {
  style: CSSProperties
}

const socketURL = "ws://127.0.0.1:11223/term";
export default function WebTerminal({style}: WebTerminalProps) {
  useEffect(() => {
    var terminal = new Terminal({
      fontFamily: 'MesloLGS NF',
      fontSize: 12,
      cols: 80,
      rows: 24,
      cursorBlink: true,
    });
    //@ts-ignore
    terminal.open(document.getElementById("terminal"));
    var ws = new WebSocket(socketURL);
    var attachAddon = new AttachAddon(ws);
    ws.onclose = function(event) {
      console.log(event);
      terminal.write('\r\n\nconnection has been terminated from the server-side (hit refresh to restart)\n')
    };
    ws.onopen = function() {
      terminal.loadAddon(attachAddon);
      terminal.focus();
    };
    return () => {
      terminal.dispose();
    };
  }, []);
  return <div id="terminal" style={style}></div>;
}

