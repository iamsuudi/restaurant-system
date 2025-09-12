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

func (h *Handler) CountActiveOrders(c *gin.Context) {
	count, err := h.service.CountActiveOrders(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, count)
}
