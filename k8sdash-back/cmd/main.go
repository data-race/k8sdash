package main

import (
	"github.com/data-race/k8sdash-back/config"
	"github.com/data-race/k8sdash-back/log"
	"github.com/spf13/pflag"
)

func main() {
	configPath := pflag.String("config", "./config.yaml", "path to config file(default:\"./config.yaml\")")
	pflag.Parse()
	err := config.LoadConfig(*configPath)
	if err != nil {
		panic(err)
	}

	log.GetLogger().Info("zap logger Initialized")

}
