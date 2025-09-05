package ws

import (
	"github.com/gin-gonic/gin"

	"restaurant-server/internal/auth"
	"restaurant-server/internal/realtime"
)

func RegisterRoutes(r *gin.RouterGroup, hub *realtime.Hub) {
	r.GET("/:channel", auth.Authenticate(), Handler(hub))
}
