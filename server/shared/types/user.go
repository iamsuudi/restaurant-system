package types

type UserPayload struct {
	Name     string `form:"name"`
	Email    string `form:"email"`
	Phone    string `form:"phone"`
	Role     string `form:"role"`
	Password string `form:"password"`
}

type UserEditPayload struct {
	Name  *string `form:"name"`
	Email *string `form:"email"`
	Phone *string `form:"phone"`
	Role  *string `form:"role"`
}
