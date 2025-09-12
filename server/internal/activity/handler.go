package activity

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx"

	"restaurant-server/internal/repository"
	"restaurant-server/shared/utils"
)

type Handler struct {
	service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) GetLogs(c *gin.Context) {
	limit, offset, _ := utils.PaginationHelper(c)

	count, logs, err := h.service.ListAuditLogs(c.Request.Context(), limit, offset)
	if err != nil {
		fmt.Print(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch logs"})
		return
	}
	if logs == nil {
		logs = []repository.ListAuditLogsRow{}
	}

	c.JSON(http.StatusOK, gin.H{
		"logs":  logs,
		"count": count,
	})
}

func (h *Handler) GetLog(c *gin.Context) {
	raw := c.Param("id")
	logID, err := strconv.Atoi(raw)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid audit log ID"})
		return
	}

	log, err := h.service.GetAuditLog(c.Request.Context(), int32(logID))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Audit log not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch audit log"})
		}
		return
	}

	c.JSON(http.StatusOK, log)
}
