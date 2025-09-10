package orders

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"restaurant-server/internal/auth"
	"restaurant-server/internal/repository"
)

func RegisterRoutes(rg *gin.RouterGroup, db *pgxpool.Pool, q *repository.Queries) {
	service := NewService(db, q)
	handler := NewHandler(service)

	grp := rg.Group("/orders", auth.Authenticate())
	{
		grp.GET("/", handler.ListOrders)
		grp.GET("/completed", handler.ListCompletedOrders)
		grp.GET("/:id", handler.GetOrder)
		grp.GET("/:id/items", handler.GetOrderItems)
		grp.PUT("/:id", auth.Authorize("kitchen", "waiter"), handler.UpdateOrder)
		grp.PUT("/:id/status", auth.Authorize("kitchen", "waiter"), handler.UpdateOrderStatus)
		grp.DELETE("/:id", auth.Authorize("kitchen", "waiter"), handler.DeleteOrder)
		grp.POST("/", handler.CreateOrder)
	}
}
