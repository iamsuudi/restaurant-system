package realtime

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"

	"restaurant-server/internal/auth"
)

type Client struct {
	hub     *Hub
	conn    *websocket.Conn
	user    *auth.Claims // ID, Role
	channels map[Channel]struct{}
	send    chan []byte
}

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}

func ServeWS(h *Hub, w http.ResponseWriter, r *http.Request, ch Channel, user *auth.Claims) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("ws upgrade:", err)
		return
	}
	client := &Client{
		hub:     h,
		conn:    conn,
		user:    user,
		channels: make(map[Channel]struct{}),
		send:    make(chan []byte, 256),
	}
	client.channels[ch] = struct{}{}
	h.Register(client)
	go client.writePump()
	go client.readPump()
}

func (c *Client) readPump() {
	defer func() {
		c.hub.Unregister(c)
		c.conn.Close()
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
	}()
	for msg := range c.send {
		if err := c.conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			return
		}
	}
}

func (c *Client) safeSend(b []byte) {
	select {
	case c.send <- b:
	default:
		// client is slow; drop message
		log.Printf("client %s is slow, dropping message", c.user.ID)
	}
}