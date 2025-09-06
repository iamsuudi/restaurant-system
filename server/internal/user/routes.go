package user

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"restaurant-server/internal/auth"
	"restaurant-server/internal/repository"
)

func RegisterRoutes(rg *gin.RouterGroup, db *pgxpool.Pool, q *repository.Queries) {
	service := NewService(db, q)
	handler := NewHandler(service)

	r := rg.Group("/users", auth.Authenticate())
	{
		r.GET("/", handler.GetUsers)
		r.GET("/:id", handler.GetUser)
		r.PUT("/:id/info", handler.UpdateUserInfo)
	}
}
