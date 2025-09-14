package analytics

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) CountCompletedOrders(c *gin.Context) {
	target := c.Param("target")
	switch target {
	case "daily":
		count, err := h.service.CountDailyCompletedOrders(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "weekly":
		count, err := h.service.CountWeeklyCompletedOrders(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "monthly":
		count, err := h.service.CountMonthlyCompletedOrders(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	default:
		fmt.Println("Invalid target")
		c.JSON(http.StatusBadRequest, "Invalid target")
	}
}

func (h *Handler) AvgPrepTime(c *gin.Context) {
	target := c.Param("target")
	switch target {
	case "daily":
		count, err := h.service.DailyAvgPrepTime(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "weekly":
		count, err := h.service.WeeklyAvgPrepTime(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "monthly":
		count, err := h.service.MonthlyAvgPrepTime(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	default:
		c.JSON(http.StatusBadRequest, "Invalid target")
	}
}

func (h *Handler) OrdersByCategory(c *gin.Context) {
	target := c.Param("target")
	switch target {
	case "daily":
		count, err := h.service.OrdersByCategoryDaily(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "weekly":
		count, err := h.service.OrdersByCategoryWeekly(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "monthly":
		count, err := h.service.OrdersByCategoryMonthly(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	default:
		c.JSON(http.StatusBadRequest, "Invalid target")
	}
}

func (h *Handler) WaiterPerformance(c *gin.Context) {
	target := c.Param("target")
	switch target {
	case "daily":
		count, err := h.service.WaiterPerformanceDaily(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "weekly":
		count, err := h.service.WaiterPerformanceWeekly(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "monthly":
		count, err := h.service.WaiterPerformanceMonthly(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	default:
		c.JSON(http.StatusBadRequest, "Invalid target")
	}
}

func (h *Handler) OrdersAndRevenue(c *gin.Context) {
	target := c.Param("target")
	switch target {
	case "daily":
		count, err := h.service.OrdersAndRevenueDaily(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "weekly":
		count, err := h.service.OrdersAndRevenueWeekly(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "monthly":
		count, err := h.service.OrdersAndRevenueMonthly(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	default:
		c.JSON(http.StatusBadRequest, "Invalid target")
	}
}

func (h *Handler) WaiterSelfPerformance(c *gin.Context) {
	raw, _ := c.Get("user_id")
	waiterID, _ := raw.(int32)

	target := c.Param("target")
	switch target {
	case "daily":
		count, err := h.service.WaiterSelfPerformanceDaily(c, waiterID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "weekly":
		count, err := h.service.WaiterSelfPerformanceWeekly(c, waiterID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	case "monthly":
		count, err := h.service.WaiterSelfPerformanceMonthly(c, waiterID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, count)
	default:
		c.JSON(http.StatusBadRequest, "Invalid target")
	}
}

func (h *Handler) WaiterPerformanceSummary(c *gin.Context) {
	count, err := h.service.WaiterPerformanceSummary(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, count)
}

func (h *Handler) CountActiveOrders(c *gin.Context) {
	count, err := h.service.CountActiveOrders(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, count)
}

func (h *Handler) TopSellingItems(c *gin.Context) {
	items, err := h.service.TopSellingItems(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *Handler) TopActiveUsers(c *gin.Context) {
	count, err := h.service.TopActiveUsers(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, count)
}

func (h *Handler) TotalRevenue(c *gin.Context) {
	revenue, err := h.service.TotalRevenue(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, revenue)
}
