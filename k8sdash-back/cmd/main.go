package main

import (
	"fmt"

	"github.com/data-race/k8sdash-back/config"
	"github.com/data-race/k8sdash-back/internal"
	"github.com/data-race/k8sdash-back/log"
	"github.com/gin-gonic/gin"
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
	router := gin.Default()
	_ = router.SetTrustedProxies(nil)
	router.Use(internal.GinLogger(log.GetLogger()))
	router.GET(config.Conf.PathTerm, internal.TermHandler)
	if err = router.Run(fmt.Sprintf("%s:%d", config.Conf.ServerAddr, config.Conf.ServerPort)); err != nil {
		log.GetLogger().Error(err.Error())
		panic(err)
	}
}
