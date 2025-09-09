package orders

import (
	"context"
	"errors"

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

func (s *Service) CreateOrder(ctx context.Context, actorID *int32, input types.OrderPayload) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.q.WithTx(tx)

	// 1. Create order
	order, err := qtx.CreateOrder(ctx, repository.CreateOrderParams{
		WaiterID:    actorID,
		Status:      "Pending",
		TableNumber: input.TableNumber,
		Note:        input.Note,
		TotalPrice:  input.Total,
	})
	if err != nil {
		return err
	}

	// 2. Create Order-Items
	for _, item := range input.Items {
		_, err = qtx.AddOrderItem(ctx, repository.AddOrderItemParams{
			OrderID:    order.ID,
			MenuItemID: item.MenuID,
			Quantity:   item.Quantity,
		})
		if err != nil {
			return err
		}
	}

	// 3. Insert audit log
	// err = qtx.InsertAuditLog(ctx, repository.InsertAuditLogParams{
	// 	ActorID:          actorID,
	// 	TargetResidentID: &resident.ID,
	// 	ActionType:       "CREATE_RESIDENT",
	// 	ObjectType:       "resident",
	// 	Diff: map[string]any{
	// 		"after": resident,
	// 	},
	// })
	// if err != nil {
	// 	return err
	// }

	return tx.Commit(ctx)
}

func (s *Service) EditOrder(ctx context.Context, actorID *int32, id int32, input types.OrderEditPayload) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.q.WithTx(tx)

	// 1. Get order
	order, err := qtx.GetOrder(ctx, id)
	if err != nil {
		return err
	}

	if order.Status != "Pending" {
		return errors.New("Status must be pending")
	}

	status := "Pending"

	// 2. Create order
	_, err = qtx.UpdateOrder(ctx, repository.UpdateOrderParams{
		ID:          order.ID,
		WaiterID:    actorID,
		Status:      &status,
		Note:        input.Note,
		TableNumber: input.TableNumber,
		TotalPrice:  input.Total,
	})
	if err != nil {
		return err
	}

	// 2. Update Order-Items
	err = qtx.ClearOrderItems(ctx, order.ID)
	if err != nil {
		return err
	}
	newItems := types.ItemsType{}
	if input.Items != nil {
		newItems = *input.Items
	}
	for _, item := range newItems {
		_, err = qtx.AddOrderItem(ctx, repository.AddOrderItemParams{
			OrderID:    order.ID,
			MenuItemID: item.MenuID,
			Quantity:   item.Quantity,
		})
		if err != nil {
			return err
		}
	}

	// 3. Insert audit log
	// err = qtx.InsertAuditLog(ctx, repository.InsertAuditLogParams{
	// 	ActorID:          actorID,
	// 	TargetResidentID: &resident.ID,
	// 	ActionType:       "CREATE_RESIDENT",
	// 	ObjectType:       "resident",
	// 	Diff: map[string]any{
	// 		"after": resident,
	// 	},
	// })
	// if err != nil {
	// 	return err
	// }

	return tx.Commit(ctx)
}

func (s *Service) GetOrder(ctx context.Context, id int32) (repository.GetOrderRow, error) {
	return s.q.GetOrder(ctx, id)
}

func (s *Service) GetOrderItems(ctx context.Context, id int32) ([]repository.GetOrderItemsRow, error) {
	return s.q.GetOrderItems(ctx, id)
}

func (s *Service) UpdateOrderStatus(ctx context.Context, id int32, status string) (repository.Order, error) {
	return s.q.UpdateOrderStatus(ctx, repository.UpdateOrderStatusParams{
		ID:     id,
		Status: status,
	})
}

func (s *Service) ListOrders(ctx context.Context, limit, offset int) (int64, []repository.ListOrdersRow, error) {
	count, err := s.q.CountListOrders(ctx)
	if err != nil {
		return 0, nil, err
	}

	orders, err := s.q.ListOrders(ctx, repository.ListOrdersParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return 0, nil, err
	}

	return count, orders, nil
}

func (s *Service) ListCompletedOrders(ctx context.Context, limit, offset int) (int64, []repository.ListCompletedOrdersRow, error) {
	count, err := s.q.CountListCompletedOrders(ctx)
	if err != nil {
		return 0, nil, err
	}

	orders, err := s.q.ListCompletedOrders(ctx, repository.ListCompletedOrdersParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return 0, nil, err
	}

	return count, orders, nil
}

func (s *Service) DeleteOrder(ctx context.Context, id int32) error {
	return s.q.DeleteOrder(ctx, id)
}
