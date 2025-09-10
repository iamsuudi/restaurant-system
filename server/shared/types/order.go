package types

type ItemsType []struct {
	MenuID   int32   `json:"menu_item_id"`
	Quantity int32   `json:"quantity"`
	Price    float32 `json:"price"`
	Category string  `json:"category"`
}

type OrderPayload struct {
	TableNumber string    `json:"table_number"`
	Items       ItemsType `json:"items" binding:"required"`
	Total       float32   `json:"total_price" binding:"required"`
	Note        *string   `json:"note"`
}

type OrderEditPayload struct {
	TableNumber *string    `json:"table_number"`
	Items       *ItemsType `json:"items"`
	Total       *float32   `json:"total_price"`
	Note        *string    `json:"note"`
}
