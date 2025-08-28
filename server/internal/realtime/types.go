package realtime

type Channel string

const (
	ChannelOrders Channel = "orders"
	ChannelMenu   Channel = "menu"
)

type EventType string

const (
	EventOrderCreated EventType = "order.created"
	EventOrderUpdated EventType = "order.updated"
	EventMenuUpdated  EventType = "menu.updated"
)

type Event struct {
	Type    EventType   `json:"type"`
	Channel Channel     `json:"channel"`
	Payload interface{} `json:"payload"`
}
