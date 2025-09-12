package user

import (
	"errors"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"restaurant-server/shared/types"
	"restaurant-server/shared/utils"
)

type Handler struct {
	service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) GetUser(c *gin.Context) {
	raw := c.Param("id")
	id, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	user, err := h.service.GetUserById(c.Request.Context(), int32(id))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		}
		return
	}
	c.JSON(http.StatusOK, user)
}

func (h *Handler) GetUsers(c *gin.Context) {
	users, err := h.service.ListUsers(c.Request.Context())
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Users not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		}
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *Handler) UpdateUserInfo(c *gin.Context) {
	raw := c.Param("id")
	targetId, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var input types.UserEditPayload
	if err = c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var picture *string
	if pic, err := c.FormFile("picture"); err == nil {
		filename := utils.MakeFileName(pic.Filename)
		if err := c.SaveUploadedFile(pic, filepath.Join("uploads", filename)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save picture"})
			return
		}
		picture = &filename
	}

	ra, _ := c.Get("user_id")
	actorID, _ := ra.(int32)

	err = h.service.UpdateUserInfo(c, actorID, int32(targetId), input, picture)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "User updated successfully"})
}

func (h *Handler) ToggleUserStatus(c *gin.Context) {
	raw := c.Param("id")
	targetId, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	ra, _ := c.Get("user_id")
	actorID, _ := ra.(int32)

	err = h.service.ToggleUserStatus(c, actorID, int32(targetId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "User blocked successfully"})
}
