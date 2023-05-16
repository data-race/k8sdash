package log

import (
	"sync"

	"github.com/data-race/k8sdash-back/config"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var logger *zap.Logger
var once sync.Once

func GetLogger() *zap.Logger {
	once.Do(func() {
		var err error
		loggerConfig := zap.NewDevelopmentConfig()
		loggerConfig.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
		switch config.Conf.LogLevel {
		case "info":
			loggerConfig.Level = zap.NewAtomicLevelAt(zap.InfoLevel)
		case "debug":
			loggerConfig.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
		case "warn":
			loggerConfig.Level = zap.NewAtomicLevelAt(zap.WarnLevel)
		default:
			loggerConfig.Level = zap.NewAtomicLevelAt(zap.InfoLevel)
		}
		logger, err = loggerConfig.Build()
		if err != nil {
			panic(err)
		}
	})
	return logger
}
