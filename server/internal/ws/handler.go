package ws

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"restaurant-server/internal/auth"
	"restaurant-server/internal/realtime"
)

func Handler(hub *realtime.Hub) gin.HandlerFunc {
	return func(c *gin.Context) {
		channel := c.Param("channel")
		if channel == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "channel is required"})
			return
		}

		user := auth.GetUser(c)
		if user == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		realtime.ServeWS(hub, c.Writer, c.Request, realtime.Channel(channel), user)
	}
}
