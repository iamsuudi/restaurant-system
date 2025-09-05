package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"restaurant-server/database"
	"restaurant-server/internal/auth"
	"restaurant-server/internal/menu"
	"restaurant-server/internal/orders"
	"restaurant-server/internal/realtime"
	"restaurant-server/internal/repository"
	"restaurant-server/internal/ws"
	"restaurant-server/shared/config"
	"restaurant-server/shared/email"
)

func main() {
	config.Load()

	db := database.Connect()
	defer db.Close()

	gin.DisableConsoleColor()

	q := repository.New(db)

	emailService, err := email.DefaultService()
	if err != nil {
		log.Fatal(err)
	}

	// Single shared Hub for all topics (orders, menu) with per-channel subscriptions
	hub := realtime.NewHub()
	go hub.Run()

	r := gin.Default()

	auth.RegisterRoutes(r.Group("/api/auth"), db, q, emailService)
	orders.RegisterRoutes(r.Group("/api/orders"), hub)
	menu.RegisterRoutes(r.Group("/api/menus"), hub)

	// WebSocket endpoints
	wsGroup := r.Group("/ws")
	{
		ws.RegisterRoutes(wsGroup, hub)
	}

	r.Run(":8080")
}
