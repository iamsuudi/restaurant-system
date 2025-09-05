package realtime

import (
	"encoding/json"
	"sync"

	"restaurant-server/internal/auth"
)

type Hub struct {
	clientsMu sync.RWMutex
	clients   map[*Client]struct{}

	// channel-specific broadcast queues
	broadcast chan Event

	register   chan *Client
	unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]struct{}),
		broadcast:  make(chan Event, 1024),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clientsMu.Lock()
			h.clients[client] = struct{}{}
			h.clientsMu.Unlock()
		case client := <-h.unregister:
			h.clientsMu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			h.clientsMu.Unlock()
		case evt := <-h.broadcast:
			payload, _ := json.Marshal(evt)
			h.clientsMu.RLock()
			for c := range h.clients {
				if _, ok := c.channels[evt.Channel]; !ok {
					continue
				}

				switch evt.Channel {
				case ChannelOrders:
					if auth.Can(c.user.Role, "orders:read") {
						c.safeSend(payload)
					}
				case ChannelMenu:
					if auth.Can(c.user.Role, "menu:read") {
						c.safeSend(payload)
					}
				}
			}
			h.clientsMu.RUnlock()
		}
	}
}

func (h *Hub) Register(c *Client) {
	h.register <- c
}

func (h *Hub) Unregister(c *Client) {
	h.unregister <- c
}

func (h *Hub) Emit(evt Event) {
	h.broadcast <- evt
}