package menu

import (
	"restaurant-server/internal/auth"
	"restaurant-server/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func RegisterRoutes(rg *gin.RouterGroup, db *pgxpool.Pool, q *repository.Queries) {
	service := NewService(db, q)
	handler := NewHandler(service)

	grp := rg.Group("/menu", auth.Authenticate())
	{
		grp.GET("/", handler.ListAllMenu)
		grp.GET("/:id", handler.GetMenuByID)
		grp.PUT("/:id", auth.Authorize("kitchen"), handler.UpdateMenu)
		grp.DELETE("/:id", auth.Authorize("kitchen"), handler.DeleteMenu)
		grp.POST("/", handler.CreateMenu)
	}
}
