package types

type MenuPayload struct {
	Name        string   `form:"name" binding:"required"`
	Price       float64  `form:"price" binding:"required"`
	Category    string   `form:"category" binding:"required"`
	Description string   `form:"description"`
	Ingredients []string `form:"ingredients"`
}

type MenuEditPayload struct {
	Name        *string   `form:"name"`
	Category    *string   `form:"category"`
	Price       *float64  `form:"price" validate:"omitempty,gt=0"`
	Status      *bool     `form:"status"`
	Description *string   `form:"description"`
	Ingredients *[]string `form:"ingredients"`
}
