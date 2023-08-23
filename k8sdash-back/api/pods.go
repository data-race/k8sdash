package api

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/data-race/k8sdash-back/utils"
	"github.com/gin-gonic/gin"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type myPod struct {
	Namespace       string `json:"namespace"`
	Name            string `json:"name"`
	Status          string `json:"status"`
	Containers      int    `json:"containers"`
	ReadyContainers int    `json:"readycontainers"`
	Age             int    `json:"age"`
	Restarts        int    `json:"restarts"`
}

func ListPods(c *gin.Context) {
	k8sContext := c.Query("context")
	clientset, ok := utils.Clients[k8sContext]
	if !ok {
		_ = c.Error(fmt.Errorf("context: %s not fount", k8sContext))
	}
	pods, err := clientset.CoreV1().Pods("").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		_ = c.Error(err)
	}
	podItems := []myPod{}
	for _, pod := range pods.Items {
		readyContainers := 0
		restartCount := 0
		for _, containerStatus := range pod.Status.ContainerStatuses {
			if containerStatus.Ready {
				readyContainers += 1
			}
			restartCount = int(containerStatus.RestartCount)
		}
		podItem := myPod{
			Namespace:       pod.Namespace,
			Name:            pod.Name,
			Status:          string(pod.Status.Phase),
			Containers:      len(pod.Spec.Containers),
			ReadyContainers: readyContainers,
			Restarts:        restartCount,
		}

		if pod.Status.StartTime != nil {
			podItem.Age = int(time.Since(pod.Status.StartTime.Time).Seconds())
		}

		podItems = append(podItems, podItem)
	}

	c.JSON(http.StatusOK, podItems)

}
