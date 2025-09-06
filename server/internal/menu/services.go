package menu

import (
	"context"
	"restaurant-server/internal/repository"
	"restaurant-server/shared/types"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	db *pgxpool.Pool
	q  *repository.Queries
}

func NewService(dbConn *pgxpool.Pool, dbQueries *repository.Queries) *Service {
	return &Service{db: dbConn, q: dbQueries}
}

func (s *Service) CreateMenu(ctx context.Context, input types.MenuPayload, pic string) (repository.MenuItem, error) {
	return s.q.CreateMenuItem(ctx, repository.CreateMenuItemParams{
		Name:        input.Name,
		Price:       input.Price,
		Description: &input.Description,
		Picture:     pic,
	})
}

func (s *Service) ListAllMenu(ctx context.Context) ([]repository.MenuItem, error) {
	return s.q.ListMenuItems(ctx)
}

func (s *Service) GetMenuByID(ctx context.Context, id int32) (repository.MenuItem, error) {
	return s.q.GetMenuItem(ctx, id)
}

func (s *Service) UpdateMenu(ctx context.Context, id int32, name, description, pic *string, price *float64) (repository.MenuItem, error) {
	return s.q.UpdateMenuItem(ctx, repository.UpdateMenuItemParams{
		ID:          id,
		Name:        name,
		Price:       price,
		Description: description,
		Picture:     pic,
	})
}

func (s *Service) DeleteMenu(ctx context.Context, id int32) error {
	return s.q.DeleteMenuItem(ctx, id)
}
