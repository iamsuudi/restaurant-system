package orders

import (
	"restaurant-server/internal/auth"
	"restaurant-server/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func RegisterRoutes(rg *gin.RouterGroup, db *pgxpool.Pool, q *repository.Queries) {
	service := NewService(db, q)
	handler := NewHandler(service)

	grp := rg.Group("/orders", auth.Authenticate())
	{
		grp.GET("/", handler.ListOrders)
		grp.GET("/completed", handler.ListCompletedOrders)
		grp.GET("/:id", handler.GetOrder)
		grp.PUT("/:id", auth.Authorize("kitchen", "waiter"), handler.UpdateOrder)
		grp.DELETE("/:id", auth.Authorize("kitchen", "waiter"), handler.DeleteOrder)
		grp.POST("/", handler.CreateOrder)
	}
}
