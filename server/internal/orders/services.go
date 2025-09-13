package orders

import (
	"context"
	"errors"

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

func (s *Service) CreateOrder(ctx context.Context, actorID int32, input types.OrderPayload) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.q.WithTx(tx)

	// 1. Create order
	order, err := qtx.CreateOrder(ctx, repository.CreateOrderParams{
		WaiterID:    &actorID,
		Status:      "pending",
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
			Price:      item.Price,
			Category:   item.Category,
		})
		if err != nil {
			return err
		}
	}

	// 3. Insert audit log
	err = qtx.InsertAuditLog(ctx, repository.InsertAuditLogParams{
		ActorID:       actorID,
		ObjectType:    "order",
		ActionType:    "CREATE_ORDER",
		TargetOrderID: &order.ID,
		Diff: map[string]any{
			"after": order,
		},
	})
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (s *Service) EditOrder(ctx context.Context, actorID int32, id int32, input types.OrderEditPayload) error {
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

	if order.Status != "pending" {
		return errors.New("Status must be pending")
	}

	// 2. Edit order
	after, err := qtx.UpdateOrder(ctx, repository.UpdateOrderParams{
		ID:          order.ID,
		Note:        input.Note,
		TableNumber: input.TableNumber,
		TotalPrice:  input.Total,
	})
	if err != nil {
		return err
	}

	// 3. Update Order-Items
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
			Price:      item.Price,
			Category:   item.Category,
		})
		if err != nil {
			return err
		}
	}

	// 4. Insert audit log
	err = qtx.InsertAuditLog(ctx, repository.InsertAuditLogParams{
		ActorID:       actorID,
		ObjectType:    "order",
		ActionType:    "UPDATE_ORDER",
		TargetOrderID: &order.ID,
		Diff: map[string]any{
			"before": order,
			"after":  after,
		},
	})
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (s *Service) UpdateOrderStatus(ctx context.Context, actorID int32, id int32, status string) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.q.WithTx(tx)

	// 1. Get order
	before, err := qtx.GetOrder(ctx, id)
	if err != nil {
		return err
	}

	if before.Status == "delivered" {
		return errors.New("Order is already delivered")
	} else if status == "cancelled" {
		return errors.New("Order is already cancelled")
	}

	// 2. Edit order status
	after, err := qtx.UpdateOrder(ctx, repository.UpdateOrderParams{
		ID:     before.ID,
		Status: &status,
	})
	if err != nil {
		return err
	}

	// 3. Insert audit log
	err = qtx.InsertAuditLog(ctx, repository.InsertAuditLogParams{
		ActorID:       actorID,
		ObjectType:    "order",
		ActionType:    "UPDATE_ORDER_STATUS",
		TargetOrderID: &id,
		Diff: map[string]any{
			"before": before,
			"after":  after,
		},
	})
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (s *Service) GetOrder(ctx context.Context, id int32) (repository.GetOrderRow, error) {
	return s.q.GetOrder(ctx, id)
}

func (s *Service) GetOrderItems(ctx context.Context, id int32) ([]repository.GetOrderItemsRow, error) {
	return s.q.GetOrderItems(ctx, id)
}

func (s *Service) ListPendingOrders(ctx context.Context, limit, offset int) (int64, []repository.ListPendingOrdersRow, error) {
	count, err := s.q.CountPendingOrders(ctx)
	if err != nil {
		return 0, nil, err
	}

	orders, err := s.q.ListPendingOrders(ctx, repository.ListPendingOrdersParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return 0, nil, err
	}

	return count, orders, nil
}

func (s *Service) ListProcessingOrders(ctx context.Context, limit, offset int) (int64, []repository.ListProcessingOrdersRow, error) {
	count, err := s.q.CountProcessingOrders(ctx)
	if err != nil {
		return 0, nil, err
	}

	orders, err := s.q.ListProcessingOrders(ctx, repository.ListProcessingOrdersParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return 0, nil, err
	}

	return count, orders, nil
}

func (s *Service) ListReadyOrders(ctx context.Context, limit, offset int) (int64, []repository.ListReadyOrdersRow, error) {
	count, err := s.q.CountReadyOrders(ctx)
	if err != nil {
		return 0, nil, err
	}

	orders, err := s.q.ListReadyOrders(ctx, repository.ListReadyOrdersParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return 0, nil, err
	}

	return count, orders, nil
}

func (s *Service) ListDeliveredOrders(ctx context.Context, limit, offset int) (int64, []repository.ListDeliveredOrdersRow, error) {
	count, err := s.q.CountDeliveredOrders(ctx)
	if err != nil {
		return 0, nil, err
	}

	orders, err := s.q.ListDeliveredOrders(ctx, repository.ListDeliveredOrdersParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return 0, nil, err
	}

	return count, orders, nil
}

func (s *Service) ListCancelledOrders(ctx context.Context, limit, offset int) (int64, []repository.ListCancelledOrdersRow, error) {
	count, err := s.q.CountCancelledOrders(ctx)
	if err != nil {
		return 0, nil, err
	}

	orders, err := s.q.ListCancelledOrders(ctx, repository.ListCancelledOrdersParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return 0, nil, err
	}

	return count, orders, nil
}

func (s *Service) DeleteOrder(ctx context.Context, actorID, id int32) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.q.WithTx(tx)

	// 1. Get order
	before, err := qtx.GetOrder(ctx, id)
	if err != nil {
		return err
	}

	if before.Status == "delivered" {
		return errors.New("Order is already delivered")
	}

	status := "cancelled"

	// 2. Edit order status
	after, err := qtx.UpdateOrder(ctx, repository.UpdateOrderParams{
		ID:       before.ID,
		WaiterID: &actorID,
		Status:   &status,
	})
	if err != nil {
		return err
	}

	// 3. Insert audit log
	err = qtx.InsertAuditLog(ctx, repository.InsertAuditLogParams{
		ActorID:       actorID,
		ObjectType:    "order",
		ActionType:    "DELETE_ORDER",
		TargetOrderID: &id,
		Diff: map[string]any{
			"before": map[string]interface{}{
				"id":       before.ID,
				"waiterID": before.WaiterID,
				"status":   before.Status,
			},
			"after": map[string]interface{}{
				"id":       after.ID,
				"waiterID": after.WaiterID,
				"status":   after.Status,
			},
		},
	})
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}
