package menu

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

func (s *Service) CreateMenu(ctx context.Context, input types.MenuPayload, pic string) (repository.MenuItem, error) {
	return s.q.CreateMenuItem(ctx, repository.CreateMenuItemParams{
		Name:        input.Name,
		Price:       input.Price,
		Picture:     pic,
		Category:    input.Category,
		Description: &input.Description,
		Ingredients: input.Ingredients,
	})
}

func (s *Service) ListAllMenu(ctx context.Context) ([]repository.MenuItem, error) {
	return s.q.ListMenuItems(ctx)
}

func (s *Service) ListActiveMenu(ctx context.Context) ([]repository.MenuItem, error) {
	return s.q.ListActiveMenuItems(ctx)
}

func (s *Service) GetMenuByID(ctx context.Context, id int32) (repository.MenuItem, error) {
	return s.q.GetMenuItem(ctx, id)
}

func (s *Service) UpdateMenu(ctx context.Context, id int32, input types.MenuEditPayload, pic *string) (repository.MenuItem, error) {
	return s.q.UpdateMenuItem(ctx, repository.UpdateMenuItemParams{
		ID:          id,
		Name:        input.Name,
		Price:       input.Price,
		Description: input.Description,
		Category:    input.Category,
		Status:      input.Status,
		Picture:     pic,
	})
}

func (s *Service) DeleteMenu(ctx context.Context, id int32) error {
	return s.q.DeleteMenuItem(ctx, id)
}
