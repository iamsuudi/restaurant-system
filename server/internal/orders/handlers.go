package orders

import (
	"net/http"
	"restaurant-server/internal/repository"
	"restaurant-server/shared/types"
	"restaurant-server/shared/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) CreateOrder(c *gin.Context) {
	raw, _ := c.Get("user_id")
	actorID, _ := raw.(int32)

	var input types.OrderPayload
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.CreateOrder(c, actorID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully"})
}

func (h *Handler) ListOrders(c *gin.Context) {
	limit, offset, _ := utils.PaginationHelper(c)
	target := c.Param("target")

	switch target {
	case "pending":
		count, orders, err := h.service.ListPendingOrders(c, limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
			return
		}
		if orders == nil {
			orders = []repository.ListPendingOrdersRow{}
		}

		c.JSON(http.StatusOK, gin.H{
			"orders": orders,
			"count":  count,
		})
	case "cancelled":
		count, orders, err := h.service.ListCancelledOrders(c, limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
			return
		}
		if orders == nil {
			orders = []repository.ListCancelledOrdersRow{}
		}

		c.JSON(http.StatusOK, gin.H{
			"orders": orders,
			"count":  count,
		})
	case "processing":
		count, orders, err := h.service.ListProcessingOrders(c, limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
			return
		}
		if orders == nil {
			orders = []repository.ListProcessingOrdersRow{}
		}

		c.JSON(http.StatusOK, gin.H{
			"orders": orders,
			"count":  count,
		})
	case "ready":
		count, orders, err := h.service.ListReadyOrders(c, limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
			return
		}
		if orders == nil {
			orders = []repository.ListReadyOrdersRow{}
		}

		c.JSON(http.StatusOK, gin.H{
			"orders": orders,
			"count":  count,
		})
	case "delivered":
		count, orders, err := h.service.ListDeliveredOrders(c, limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
			return
		}
		if orders == nil {
			orders = []repository.ListDeliveredOrdersRow{}
		}

		c.JSON(http.StatusOK, gin.H{
			"orders": orders,
			"count":  count,
		})
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid target"})
	}
}

func (h *Handler) GetOrder(c *gin.Context) {
	raw := c.Param("id")
	id, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	order, err := h.service.GetOrder(c, int32(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, order)
}

func (h *Handler) UpdateOrder(c *gin.Context) {
	raw := c.Param("id")
	id, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var input types.OrderEditPayload
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ra, _ := c.Get("user_id")
	actorID, _ := ra.(int32)

	err = h.service.EditOrder(c, actorID, int32(id), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order updated"})
}

func (h *Handler) UpdateOrderStatus(c *gin.Context) {
	raw := c.Param("id")
	id, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var input struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ra, _ := c.Get("user_id")
	actorID, _ := ra.(int32)

	err = h.service.UpdateOrderStatus(c, actorID, int32(id), input.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order status updated"})
}

func (h *Handler) DeleteOrder(c *gin.Context) {
	raw := c.Param("id")
	id, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	ra, _ := c.Get("user_id")
	actorID, _ := ra.(int32)

	err = h.service.DeleteOrder(c, actorID, int32(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Order deleted"})
}

func (h *Handler) GetOrderItems(c *gin.Context) {
	raw := c.Param("id")
	id, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	items, err := h.service.GetOrderItems(c, int32(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, items)
}
