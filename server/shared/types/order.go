package types

type ItemsType []struct {
	MenuID   int32 `json:"menu_item_id"`
	Quantity int32 `json:"quantity"`
}

type OrderPayload struct {
	TableNumber string    `json:"table_number"`
	Items       ItemsType `json:"items" binding:"required"`
	Total       float32   `json:"total_price" binding:"required"`
	Note        *string   `json:"note"`
}

type OrderEditPayload struct {
	ID          int32      `json:"id" binding:"required"`
	TableNumber *string    `json:"table_number"`
	Items       *ItemsType `json:"items"`
	Total       *float32   `json:"total_price"`
	Note        *string    `json:"note"`
}
