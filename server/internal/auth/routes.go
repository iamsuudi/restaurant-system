package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type loginReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type loginRes struct {
	ID   string `json:"id"`
	Role string `json:"role"`
}

func RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("/login", login)
	rg.POST("/logout", logout)
}

func login(c *gin.Context) {
	var req loginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := findByUsername(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	tok, err := signJWT(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot sign token"})
		return
	}
	// HttpOnly cookie
	h := 24 * 3600
	c.SetCookie(cookieName, tok, h, "/", "", true, true)
	c.JSON(http.StatusOK, loginRes{ID: user.ID, Role: user.Role})
}

func logout(c *gin.Context) {
	c.SetCookie(cookieName, "", -1, "/", "", true, true)
	c.Status(http.StatusNoContent)
}
