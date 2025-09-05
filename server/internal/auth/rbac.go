package auth

const (
	RoleAdmin  = "admin"
	RoleKitchen = "kitchen"
	RoleWaiter = "waiter"
)

func Can(role string, permission string) bool {
	switch permission {
	case "orders:read":
		return role == RoleAdmin || role == RoleKitchen || role == RoleWaiter
	case "orders:write":
		return role == RoleAdmin || role == RoleWaiter
	case "menu:read":
		return true
	case "menu:write":
		return role == RoleAdmin
	default:
		return false
	}
}
