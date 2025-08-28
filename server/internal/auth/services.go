package auth

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Password string `json:"-"`
	Role     string `json:"role"` // waiter | kitchen
}

// In-memory users (replace with DB)
var users = map[string]User{
	"w1": {ID: "w1", Username: "waiter", Password: "waiter", Role: "waiter"},
	"k1": {ID: "k1", Username: "kitchen", Password: "kitchen", Role: "kitchen"},
}

func findByUsername(u, p string) (User, error) {
	for _, usr := range users {
		if usr.Username == u && usr.Password == p {
			return usr, nil
		}
	}
	return User{}, errors.New("invalid credentials")
}

type UserCtx struct {
	ID   string
	Role string
}

type Claims struct {
	UserCtx
	jwt.RegisteredClaims
}

func signJWT(u User) (string, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))
	claims := Claims{
		UserCtx: UserCtx{ID: u.ID, Role: u.Role},
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(secret)
}

func parseJWT(tokenStr string) (UserCtx, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return secret, nil
	})
	if err != nil || !token.Valid {
		return UserCtx{}, errors.New("invalid token")
	}
	claims := token.Claims.(*Claims)
	return claims.UserCtx, nil
}
