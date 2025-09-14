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
		r.GET("/orders-by-category/:target", handler.OrdersByCategory)
		r.GET("/waiter-performance/:target", handler.WaiterPerformance)
		r.GET("/waiter-self-performance/:target", handler.WaiterSelfPerformance)
		r.GET("/waiter-performance-summary", handler.WaiterPerformanceSummary)
		r.GET("/avg-prep-time/:target", handler.AvgPrepTime)
		r.GET("/orders-and-revenue/:target", handler.OrdersAndRevenue)
		r.GET("/count-active-orders", handler.CountActiveOrders)
		r.GET("/top-active-users", handler.TopActiveUsers)
		r.GET("/top-selling-items", handler.TopSellingItems)
		r.GET("/total-revenue", handler.TotalRevenue)
	}
}
