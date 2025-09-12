package activity

import (
	"restaurant-server/internal/auth"
	"restaurant-server/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func RegisterRoutes(rg *gin.RouterGroup, db *pgxpool.Pool, q *repository.Queries) {
	service := NewService(db, q)
	handler := NewHandler(service)

	r := rg.Group("/activities", auth.Authenticate())
	{
		r.GET("/", handler.GetLogs)
		r.GET("/:id", handler.GetLog)
	}
}
