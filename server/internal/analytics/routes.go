package analytics

import (
	"restaurant-server/internal/auth"
	"restaurant-server/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func RegisterRoutes(rg *gin.RouterGroup, db *pgxpool.Pool, q *repository.Queries) {
	service := NewService(db, q)
	handler := NewHandler(service)

	r := rg.Group("/analytics", auth.Authenticate())
	{
		r.GET("/count-completed-orders/:target", handler.CountCompletedOrders)
		r.GET("/avg-prep-time/:target", handler.AvgPrepTime)
		r.GET("/count-active-orders", handler.CountActiveOrders)
	}
}
