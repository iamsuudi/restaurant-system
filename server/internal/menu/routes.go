package menu

import (
	"restaurant-server/internal/auth"
	"restaurant-server/internal/realtime"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(rg *gin.RouterGroup, hub *realtime.Hub) {
	store := NewStore()
	h := NewHandlers(store, hub)

	grp := rg.Group("/menu")
	{
		grp.Use(auth.Authenticate())
		grp.GET("", h.Get)                            // any logged-in user
		grp.PUT("", auth.Authorize("kitchen"), h.Put) // kitchen only (guarded inside)
	}
}
