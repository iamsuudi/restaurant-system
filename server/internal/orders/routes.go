package orders

import (
	"restaurant-system/internal/auth"
	"restaurant-system/internal/realtime"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup, hub *realtime.Hub) {
	store := NewStore()
	h := NewHandlers(store, hub)

	grp := rg.Group("/orders")
	{
		grp.Use(auth.JWTGuard())
		grp.POST("", h.Create)           // waiter
		grp.PATCH(":id", h.UpdateStatus) // kitchen
		grp.GET("", h.List)              // waiter → own, kitchen → all
	}
}
