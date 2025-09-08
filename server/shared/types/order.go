package types

type OrderPayload struct {
	Table string          `form:"table"`
	Items map[int32]int32 `form:"items" binding:"required"`
	Total float64         `form:"total" binding:"required"`
}

type OrderEditPayload struct {
	ID    int32            `form:"id" binding:"required"`
	Table *string          `form:"table"`
	Items *map[int32]int32 `form:"items"`
	Total *float64         `form:"total"`
}
