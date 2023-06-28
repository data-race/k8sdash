package utils

import (
	"os/user"
	"path"

	"github.com/data-race/k8sdash-back/config"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

var Clients map[string]*kubernetes.Clientset

func InitClients() error {
	Clients = make(map[string]*kubernetes.Clientset)
	currentUser, err := user.Current()
	if err != nil {
		return err
	}
	kubeConfigPath := path.Join(currentUser.HomeDir, config.Conf.KubeConfigFile)
	config, err := clientcmd.LoadFromFile(kubeConfigPath)
	if err != nil {
		return err
	}

	for context := range config.Contexts {
		subConfig, err := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
			&clientcmd.ClientConfigLoadingRules{ExplicitPath: kubeConfigPath},
			&clientcmd.ConfigOverrides{CurrentContext: context},
		).ClientConfig()
		if err != nil {
			return err
		}
		clientSet, err := kubernetes.NewForConfig(subConfig)
		if err != nil {
			return err
		}
		Clients[context] = clientSet
	}
	return nil
}
