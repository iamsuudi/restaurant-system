package activity

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"

	"restaurant-server/internal/repository"
)

type Service struct {
	db *pgxpool.Pool
	q  *repository.Queries
}

func NewService(dbConn *pgxpool.Pool, dbQueries *repository.Queries) *Service {
	return &Service{db: dbConn, q: dbQueries}
}

func (s *Service) ListAuditLogs(ctx context.Context, limit, offset int) (int64, []repository.ListAuditLogsRow, error) {
	count, err := s.q.CountListAuditLogs(ctx)
	if err != nil {
		return 0, nil, err
	}
	if count == 0 {
		return 0, nil, nil
	}
	users, err := s.q.ListAuditLogs(ctx, repository.ListAuditLogsParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	return count, users, err
}

func (s *Service) GetAuditLog(ctx context.Context, id int32) (repository.GetAuditLogRow, error) {
	return s.q.GetAuditLog(ctx, id)
}
