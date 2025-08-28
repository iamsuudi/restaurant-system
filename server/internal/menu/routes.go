package menu

import (
	"github.com/gin-gonic/gin"

	"restaurant-system/internal/auth"
	"restaurant-system/internal/realtime"
)

func RegisterRoutes(rg *gin.RouterGroup, hub *realtime.Hub) {
	store := NewStore()
	h := NewHandlers(store, hub)

	grp := rg.Group("/menu")
	{
		grp.Use(auth.JWTGuard())
		grp.GET("", h.Get) // any logged-in user
		grp.PUT("", h.Put) // kitchen only (guarded inside)
	}
}
