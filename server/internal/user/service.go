package user

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"

	"restaurant-server/internal/repository"
	"restaurant-server/shared/types"
)

type Service struct {
	db *pgxpool.Pool
	q  *repository.Queries
}

func NewService(dbConn *pgxpool.Pool, dbQueries *repository.Queries) *Service {
	return &Service{db: dbConn, q: dbQueries}
}

func (s *Service) GetUserById(ctx context.Context, id int32) (repository.User, error) {
	return s.q.GetUserByID(ctx, id)
}

func (s *Service) GetUserByEmail(ctx context.Context, email string) (repository.User, error) {
	return s.q.GetUserByEmail(ctx, email)
}

func (s *Service) ListUsers(ctx context.Context) ([]repository.User, error) {
	return s.q.ListUsers(ctx)
}

func (s *Service) UpdateUserInfo(ctx context.Context, id int32, input types.UserPayload, picture *string) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.q.WithTx(tx)

	_, err = qtx.UpdateUserInfo(ctx, repository.UpdateUserInfoParams{
		ID:      id,
		Name:    &input.Name,
		Role:    &input.Role,
		Email:   &input.Email,
		Phone:   &input.Phone,
		Picture: picture,
	})
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}
