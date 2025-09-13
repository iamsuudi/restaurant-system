package analytics

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

func (s *Service) CountDailyCompletedOrders(ctx context.Context) (int64, error) {
	return s.q.CountCompletedOrdersDaily(ctx)
}

func (s *Service) CountWeeklyCompletedOrders(ctx context.Context) (int64, error) {
	return s.q.CountCompletedOrdersWeekly(ctx)
}

func (s *Service) CountMonthlyCompletedOrders(ctx context.Context) (int64, error) {
	return s.q.CountCompletedOrdersMonthly(ctx)
}

func (s *Service) DailyAvgPrepTime(ctx context.Context) (any, error) {
	return s.q.AvgPreparationTimeDaily(ctx)
}

func (s *Service) WeeklyAvgPrepTime(ctx context.Context) (any, error) {
	return s.q.AvgPreparationTimeWeekly(ctx)
}

func (s *Service) MonthlyAvgPrepTime(ctx context.Context) (any, error) {
	return s.q.AvgPreparationTimeMonthly(ctx)
}

func (s *Service) CountActiveOrders(ctx context.Context) (int64, error) {
	return s.q.CountActiveOrders(ctx)
}
