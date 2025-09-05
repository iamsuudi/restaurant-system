package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"restaurant-server/database"
	"restaurant-server/internal/auth"
	"restaurant-server/internal/menu"
	"restaurant-server/internal/orders"
	"restaurant-server/internal/realtime"
	"restaurant-server/internal/repository"
	"restaurant-server/internal/ws"
	"restaurant-server/shared/email"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	_ = os.Setenv("JWT_SECRET", "devsecret-change-me")

	db := database.Connect()
	q := repository.New(db)
	emailService, err := email.DefaultService()
	if err != nil {
		log.Fatal(err)
	}

	// Single shared Hub for all topics (orders, menu) with per-channel subscriptions
	hub := realtime.NewHub()
	go hub.Run()

	r := gin.Default()

	api := r.Group("/api")
	{
		auth.RegisterRoutes(api, db, q, emailService)
		orders.RegisterRoutes(api, hub)
		menu.RegisterRoutes(api, hub)
	}

	// WebSocket endpoints
	wsGroup := r.Group("/ws")
	{
		ws.RegisterRoutes(wsGroup, hub)
	}

	r.Run(":8080")
}
