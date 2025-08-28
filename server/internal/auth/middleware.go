package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const cookieName = "access_token"

func JWTGuard(roles ...string) gin.HandlerFunc {
	allowed := map[string]struct{}{}
	for _, r := range roles {
		allowed[r] = struct{}{}
	}
	return func(c *gin.Context) {
		tok, err := c.Cookie(cookieName)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing auth"})
			return
		}
		user, err := parseJWT(tok)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		if len(allowed) > 0 {
			if _, ok := allowed[user.Role]; !ok {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
				return
			}
		}
		c.Set("user", user)
		c.Next()
	}
}

func MustUser(c *gin.Context) UserCtx {
	v, _ := c.Get("user")
	return v.(UserCtx)
}
