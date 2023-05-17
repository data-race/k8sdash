package config

import (
	"fmt"
	"os"
	"time"

	"k8s.io/apimachinery/pkg/util/yaml"
)

type Config struct {
	AllowedHostNames     []string
	Command              string
	Args                 []string
	ServerAddr           string
	ServerPort           int
	PathTerm             string
	TermBufferSize       int
	LogLevel             string
	ConnectionErrorLimit int
	KeepAlivePingTimeout time.Duration
}

var Conf Config

func LoadConfig(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	err = yaml.Unmarshal(data, &Conf)
	if err != nil {
		return err
	}
	fmt.Printf("Using following config: %v\n", Conf)
	return nil
}
