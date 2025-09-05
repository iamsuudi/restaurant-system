package orders

import (
	"github.com/gin-gonic/gin"

	"restaurant-server/internal/auth"
	"restaurant-server/internal/realtime"
)

func RegisterRoutes(rg *gin.RouterGroup, hub *realtime.Hub) {
	store := NewStore()
	h := NewHandlers(store, hub)

	grp := rg.Group("/orders")
	{
		grp.Use(auth.Authenticate())
		grp.POST("", auth.Authorize("waiter"), h.Create)            // waiter
		grp.PATCH(":id", auth.Authorize("kitchen"), h.UpdateStatus) // kitchen
		grp.GET("", h.List)                                         // waiter → own, kitchen → all
	}
}
