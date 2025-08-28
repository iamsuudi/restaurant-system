package realtime

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"

	"restaurant-system/internal/auth"
)

type Hub struct {
	clientsMu sync.RWMutex
	clients   map[*Client]struct{}

	// channel-specific broadcast queues
	broadcast chan Event
}

type Client struct {
	hub     *Hub
	conn    *websocket.Conn
	user    auth.UserCtx // ID, Role
	channel Channel
	send    chan []byte
}

func NewHub() *Hub {
	return &Hub{
		clients:   make(map[*Client]struct{}),
		broadcast: make(chan Event, 1024),
	}
}

func (h *Hub) Run() {
	for evt := range h.broadcast {
		payload, _ := json.Marshal(evt)
		h.clientsMu.RLock()
		for c := range h.clients {
			if c.channel != evt.Channel {
				continue
			}
			// Orders: kitchen sees all; waiter only their own order events
			if evt.Channel == ChannelOrders && evt.Type != EventMenuUpdated {
				if ord, ok := evt.Payload.(map[string]interface{}); ok {
					// expect payload to include waiterId
					if c.user.Role == "kitchen" {
						c.safeSend(payload)
						continue
					}
					if c.user.Role == "waiter" {
						if wid, _ := ord["waiterId"].(string); wid == c.user.ID {
							c.safeSend(payload)
						}
					}
					continue
				}
			}
			// Menu: all waiters
			if evt.Channel == ChannelMenu {
				if c.user.Role == "waiter" {
					c.safeSend(payload)
				}
				continue
			}
		}
		h.clientsMu.RUnlock()
	}
}

func (c *Client) safeSend(b []byte) {
	select {
	case c.send <- b:
	default:
		// client is slow; drop connection
		c.conn.Close()
		c.hub.unregister(c)
	}
}

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}

func ServeWS(h *Hub, w http.ResponseWriter, r *http.Request, ch Channel, user auth.UserCtx) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("ws upgrade:", err)
		return
	}
	client := &Client{hub: h, conn: conn, user: user, channel: ch, send: make(chan []byte, 256)}
	h.register(client)
	go client.writePump()
	go client.readPump()
}

func (h *Hub) register(c *Client) {
	h.clientsMu.Lock()
	h.clients[c] = struct{}{}
	h.clientsMu.Unlock()
}

func (h *Hub) unregister(c *Client) {
	h.clientsMu.Lock()
	delete(h.clients, c)
	h.clientsMu.Unlock()
}

func (c *Client) readPump() {
	defer func() {
		c.conn.Close()
		c.hub.unregister(c)
	}()
	for {
		if _, _, err := c.conn.ReadMessage(); err != nil {
			return
		}
		// For this MVP: clients don't push via WS; use REST to mutate state.
	}
}

func (c *Client) writePump() {
	defer func() {
		c.conn.Close()
		c.hub.unregister(c)
	}()
	for msg := range c.send {
		if err := c.conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			return
		}
	}
}

func (h *Hub) Emit(evt Event) {
	h.broadcast <- evt
}
