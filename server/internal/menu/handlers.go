package menu

import (
	"net/http"
	"path/filepath"
	"restaurant-server/internal/repository"
	"restaurant-server/shared/types"
	"restaurant-server/shared/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) CreateMenu(c *gin.Context) {
	var input types.MenuPayload
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pic, err := c.FormFile("picture")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing picture"})
		return
	}
	fileName := utils.MakeFileName(pic.Filename)
	if err := c.SaveUploadedFile(pic, filepath.Join("uploads", fileName)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save image"})
		return
	}

	raw, _ := c.Get("user_id")
	actorID, _ := raw.(int32)

	err = h.service.CreateMenu(c, actorID, input, fileName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Menu created successfully"})
}

func (h *Handler) ListAllMenu(c *gin.Context) {
	ra, _ := c.Get("user_role")
	role, _ := ra.(string)

	if role == "kitchen" {
		menu, err := h.service.ListAllMenu(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if menu == nil {
			menu = []repository.MenuItem{}
		}
		c.JSON(http.StatusOK, menu)
	} else {
		menu, err := h.service.ListActiveMenu(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if menu == nil {
			menu = []repository.MenuItem{}
		}
		c.JSON(http.StatusOK, menu)
	}
}

func (h *Handler) GetMenuByID(c *gin.Context) {
	raw := c.Param("id")
	id, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	ra, _ := c.Get("user_role")
	role, _ := ra.(string)

	menu, err := h.service.GetMenuByID(c, int32(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if role != "kitchen" && menu.Status != true {
		c.JSON(http.StatusForbidden, gin.H{"error": "not allowed"})
		return
	}
	c.JSON(http.StatusOK, menu)
}

func (h *Handler) UpdateMenu(c *gin.Context) {
	raw := c.Param("id")
	id, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var input types.MenuEditPayload
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var ptr *string

	if pic, err := c.FormFile("picture"); err == nil {
		fileName := utils.MakeFileName(pic.Filename)
		if err := c.SaveUploadedFile(pic, filepath.Join("uploads", fileName)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save image"})
			return
		}
		ptr = &fileName
	}

	ra, _ := c.Get("user_id")
	actorID, _ := ra.(int32)

	err = h.service.UpdateMenu(c, actorID, int32(id), input, ptr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "menu updated successfully"})
}

func (h *Handler) DeleteMenu(c *gin.Context) {
	raw := c.Param("id")
	id, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	ra, _ := c.Get("user_id")
	actorID, _ := ra.(int32)

	err = h.service.DeleteMenu(c, actorID, int32(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "menu deleted"})
}
