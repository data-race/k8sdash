package api

import (
	"net/http"
	"os/user"
	"path"

	"github.com/data-race/k8sdash-back/config"
	"github.com/gin-gonic/gin"
	"k8s.io/client-go/tools/clientcmd"
)

type contextItem struct {
	Cluster string `json:"cluster"`
}

func ListK8sContexts(c *gin.Context) {
	currentUser, err := user.Current()
	if err != nil {
		_ = c.Error(err)
	}
	config, err := clientcmd.LoadFromFile(path.Join(currentUser.HomeDir, config.Conf.KubeConfigFile))
	if err != nil {
		_ = c.Error(err)
	}
	contexts := []contextItem{}
	for _, c := range config.Contexts {
		contexts = append(contexts, contextItem{
			Cluster: c.Cluster,
		})
	}

	c.JSON(http.StatusOK, contexts)
}
