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

func (s *Service) CreateMenu(ctx context.Context, actorID int32, input types.MenuPayload, pic string) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.q.WithTx(tx)

	// 1. Create menu item
	menu, err := qtx.CreateMenuItem(ctx, repository.CreateMenuItemParams{
		Name:        input.Name,
		Price:       input.Price,
		Picture:     pic,
		Category:    input.Category,
		Description: &input.Description,
		Ingredients: input.Ingredients,
	})
	if err != nil {
		return err
	}

	// 2. Save activity log
	if err := qtx.InsertAuditLog(ctx, repository.InsertAuditLogParams{
		ActorID:        actorID,
		ObjectType:     "menu",
		ActionType:     "CREATE_MENU",
		TargetMenuID:   &menu.ID,
		TargetMenuName: &menu.Name,
		Diff: types.JSONB{
			"after": menu,
		},
	}); err != nil {
		return err
	}

	return tx.Commit(ctx)
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

func (s *Service) UpdateMenu(ctx context.Context, actorID, id int32, input types.MenuEditPayload, pic *string) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.q.WithTx(tx)

	// 1. Before
	before, err := qtx.GetMenuItem(ctx, id)
	if err != nil {
		return err
	}

	// 2. After
	after, err := qtx.UpdateMenuItem(ctx, repository.UpdateMenuItemParams{
		ID:          id,
		Name:        input.Name,
		Price:       input.Price,
		Description: input.Description,
		Category:    input.Category,
		Status:      input.Status,
		Picture:     pic,
	})
	if err != nil {
		return err
	}

	// 3. Save activity log
	if err := qtx.InsertAuditLog(ctx, repository.InsertAuditLogParams{
		ActorID:        actorID,
		ObjectType:     "menu",
		ActionType:     "UPDATE_MENU",
		TargetMenuID:   &id,
		TargetMenuName: &before.Name,
		Diff: types.JSONB{
			"before": before,
			"after":  after,
		},
	}); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (s *Service) DeleteMenu(ctx context.Context, actorID, id int32) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.q.WithTx(tx)

	// 1. Before
	before, err := qtx.GetMenuItem(ctx, id)
	if err != nil {
		return err
	}

	// 2. After
	err = qtx.DeleteMenuItem(ctx, id)
	if err != nil {
		return err
	}

	// 3. Save activity log
	if err := qtx.InsertAuditLog(ctx, repository.InsertAuditLogParams{
		ActorID:        actorID,
		ObjectType:     "menu",
		ActionType:     "DELETE_MENU",
		TargetMenuName: &before.Name,
		Diff: types.JSONB{
			"before": before,
		},
	}); err != nil {
		return err
	}

	return tx.Commit(ctx)
}
