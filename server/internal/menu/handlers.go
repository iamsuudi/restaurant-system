package menu

import (
	"net/http"
	"restaurant-server/internal/realtime"

	"github.com/gin-gonic/gin"
)

type Handlers struct {
	store *Store
	hub   *realtime.Hub
}

func NewHandlers(store *Store, hub *realtime.Hub) *Handlers { return &Handlers{store: store, hub: hub} }

func (h *Handlers) Get(c *gin.Context) {
	c.JSON(http.StatusOK, h.store.GetAll())
}

type putReq struct {
	Items []Item `json:"items" binding:"required"`
}

func (h *Handlers) Put(c *gin.Context) {
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

	var req putReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	items := h.store.ReplaceAll(req.Items)
	// broadcast to all waiters
	h.hub.Emit(realtime.Event{Type: realtime.EventMenuUpdated, Channel: realtime.ChannelMenu, Payload: map[string]interface{}{
		"items": items,
	}})
	c.JSON(http.StatusOK, items)
}
