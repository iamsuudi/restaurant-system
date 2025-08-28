package menu

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"restaurant-system/internal/auth"
	"restaurant-system/internal/realtime"
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
	user := auth.MustUser(c)
	if user.Role != "kitchen" {
		c.JSON(http.StatusForbidden, gin.H{"error": "kitchen only"})
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
