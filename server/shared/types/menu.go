package types

type MenuPayload struct {
	Name        string  `form:"name" binding:"required"`
	Price       float64 `form:"price" binding:"required"`
	Description string  `form:"description"`
}
