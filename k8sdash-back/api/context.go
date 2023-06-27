package api

import (
	"net/http"
	"os/user"
	"path"

	"github.com/gin-gonic/gin"
	"k8s.io/client-go/tools/clientcmd"
)

type context struct {
	Cluster string `json:"cluster"`
}

func ListK8sContexts(c *gin.Context) {
	currentUser, err := user.Current()
	if err != nil {
		_ = c.Error(err)
	}
	config, err := clientcmd.LoadFromFile(path.Join(currentUser.HomeDir, ".kube/config"))
	if err != nil {
		_ = c.Error(err)
	}
	contexts := []context{}
	for _, c := range config.Contexts {
		contexts = append(contexts, context{
			Cluster: c.Cluster,
		})
	}

	c.JSON(http.StatusOK, contexts)
}
