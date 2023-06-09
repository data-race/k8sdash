package main

import (
	"fmt"

	"github.com/data-race/k8sdash-back/api"
	"github.com/data-race/k8sdash-back/config"
	"github.com/data-race/k8sdash-back/log"
	"github.com/data-race/k8sdash-back/utils"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/spf13/pflag"
)

func initConfig() {

}

func main() {
	// init config
	configPath := pflag.String("config", "./config.yaml", "path to config file(default:\"./config.yaml\")")
	pflag.Parse()
	err := config.LoadConfig(*configPath)
	if err != nil {
		panic(err)
	}
	log.GetLogger().Info("config initialized")

	// init clientset
	err = utils.InitClients()
	if err != nil {
		panic(err)
	}
	log.GetLogger().Info("clients initialized")

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:3000"}
	corsConfig.AllowMethods = []string{"GET", "POST", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "X-Api-Key", "X-Requested-With", "Content-Type", "Accept", "Authorization", "Cache-Control", "Cache", "Pragma", "Expires", "Content-Length"}
	router := gin.Default()
	_ = router.SetTrustedProxies(nil)
	router.Use(utils.GinLogger(log.GetLogger()))
	router.Use(utils.ErrorHandlingMiddleware())
	router.Use(cors.New(corsConfig))
	// API
	router.GET(config.Conf.PathTerm, api.TermHandler)
	router.GET(config.Conf.PathAPI+"context", api.ListK8sContexts)
	router.OPTIONS(config.Conf.PathAPI+"context", api.ListK8sContexts)
	router.GET(config.Conf.PathAPI+"pod", api.ListPods)
	router.OPTIONS(config.Conf.PathAPI+"pod", api.ListPods)

	if err = router.Run(fmt.Sprintf("%s:%d", config.Conf.ServerAddr, config.Conf.ServerPort)); err != nil {
		log.GetLogger().Error(err.Error())
		panic(err)
	}
}
