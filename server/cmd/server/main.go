package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"

	"restaurant-system/internal/auth"
	"restaurant-system/internal/menu"
	"restaurant-system/internal/orders"
	"restaurant-system/internal/realtime"
)

func main() {
	_ = os.Setenv("JWT_SECRET", "devsecret-change-me")

	// Single shared Hub for all topics (orders, menu) with per-channel subscriptions
	hub := realtime.NewHub()
	go hub.Run()

	r := gin.Default()
	r.Use(corsDev()) // DEV: open CORS; tighten in production

	api := r.Group("/api")
	{
		auth.RegisterRoutes(api)
		orders.RegisterRoutes(api, hub)
		menu.RegisterRoutes(api, hub)
	}

	// WebSocket endpoints
	r.GET("/ws/orders", auth.JWTGuard(), func(c *gin.Context) {
		user := auth.MustUser(c)
		realtime.ServeWS(hub, c.Writer, c.Request, realtime.ChannelOrders, user)
	})

	r.GET("/ws/menu", auth.JWTGuard(), func(c *gin.Context) {
		user := auth.MustUser(c)
		realtime.ServeWS(hub, c.Writer, c.Request, realtime.ChannelMenu, user)
	})

	srv := &http.Server{
		Addr:              ":8080",
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Println("🚀 Server running on :8080")
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}

func corsDev() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", c.GetHeader("Origin"))
		c.Writer.Header().Set("Vary", "Origin")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
