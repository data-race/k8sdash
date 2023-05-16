package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/data-race/k8sdash-back/log"
)

func addIncomingRequestLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		then := time.Now()
		defer func() {
			if recovered := recover(); recovered != nil {
				log.GetLogger().Info("request errored out")
			}
		}()
		next.ServeHTTP(w, r)
		duration := time.Since(then)
		log.GetLogger().Info(fmt.Sprintf("request completed in %vms", float64(duration.Nanoseconds())/1000000))
	})
}
