package orders

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"restaurant-server/internal/realtime"
)

type Handlers struct {
	store *Store
	hub   *realtime.Hub
}

func NewHandlers(store *Store, hub *realtime.Hub) *Handlers { return &Handlers{store: store, hub: hub} }

type createReq struct {
	Table string   `json:"table" binding:"required"`
	Items []string `json:"items" binding:"required,min=1"`
}

func (h *Handlers) Create(c *gin.Context) {
	userIDRaw, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userID, ok := userIDRaw.(int32)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID in context"})
		return
	}
	var req createReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	o := h.store.Create(req.Table, req.Items, userID)
	// broadcast to kitchen + owning waiter
	h.hub.Emit(realtime.Event{Type: realtime.EventOrderCreated, Channel: realtime.ChannelOrders, Payload: map[string]interface{}{
		"id": o.ID, "table": o.Table, "items": o.Items, "status": o.Status, "waiterId": o.WaiterID,
	}})
	c.JSON(http.StatusCreated, o)
}

type updReq struct {
	Status Status `json:"status" binding:"required"`
}

func (h *Handlers) UpdateStatus(c *gin.Context) {
	userIDRaw, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	_, ok := userIDRaw.(int32)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID in context"})
		return
	}
	id := c.Param("id")
	var req updReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	o, err := h.store.UpdateStatus(id, req.Status)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	h.hub.Emit(realtime.Event{Type: realtime.EventOrderUpdated, Channel: realtime.ChannelOrders, Payload: map[string]interface{}{
		"id": o.ID, "table": o.Table, "items": o.Items, "status": o.Status, "waiterId": o.WaiterID,
	}})
	c.JSON(http.StatusOK, o)
}

func (h *Handlers) List(c *gin.Context) {
	c.JSON(http.StatusOK, h.store.ListAll())
}
