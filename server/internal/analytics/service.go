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

func (s *Service) TotalRevenue(ctx context.Context) (any, error) {
	return s.q.TotalRevenue(ctx)
}

func (s *Service) TopSellingItems(ctx context.Context) ([]repository.TopSellingItemsRow, error) {
	return s.q.TopSellingItems(ctx)
}

func (s *Service) OrdersByCategoryDaily(ctx context.Context) ([]repository.OrdersByCategoryDailyRow, error) {
	return s.q.OrdersByCategoryDaily(ctx)
}

func (s *Service) OrdersByCategoryWeekly(ctx context.Context) ([]repository.OrdersByCategoryWeeklyRow, error) {
	return s.q.OrdersByCategoryWeekly(ctx)
}

func (s *Service) OrdersByCategoryMonthly(ctx context.Context) ([]repository.OrdersByCategoryMonthlyRow, error) {
	return s.q.OrdersByCategoryMonthly(ctx)
}

func (s *Service) OrdersAndRevenueDaily(ctx context.Context) ([]repository.OrdersAndRevenueDailyRow, error) {
	return s.q.OrdersAndRevenueDaily(ctx)
}

func (s *Service) OrdersAndRevenueWeekly(ctx context.Context) ([]repository.OrdersAndRevenueWeeklyRow, error) {
	return s.q.OrdersAndRevenueWeekly(ctx)
}

func (s *Service) OrdersAndRevenueMonthly(ctx context.Context) ([]repository.OrdersAndRevenueMonthlyRow, error) {
	return s.q.OrdersAndRevenueMonthly(ctx)
}

func (s *Service) TopActiveUsers(ctx context.Context) ([]repository.TopActiveUsersRow, error) {
	return s.q.TopActiveUsers(ctx)
}

func (s *Service) WaiterPerformanceDaily(ctx context.Context) ([]repository.WaiterPerformanceDailyRow, error) {
	return s.q.WaiterPerformanceDaily(ctx)
}

func (s *Service) WaiterPerformanceWeekly(ctx context.Context) ([]repository.WaiterPerformanceWeeklyRow, error) {
	return s.q.WaiterPerformanceWeekly(ctx)
}

func (s *Service) WaiterPerformanceMonthly(ctx context.Context) ([]repository.WaiterPerformanceMonthlyRow, error) {
	return s.q.WaiterPerformanceMonthly(ctx)
}

func (s *Service) WaiterPerformanceSummary(ctx context.Context) ([]repository.WaiterPerformanceSummaryRow, error) {
	return s.q.WaiterPerformanceSummary(ctx)
}

func (s *Service) WaiterSelfPerformanceDaily(ctx context.Context, id int32) ([]repository.WaiterSelfPerformanceDailyRow, error) {
	return s.q.WaiterSelfPerformanceDaily(ctx, id)
}

func (s *Service) WaiterSelfPerformanceWeekly(ctx context.Context, id int32) ([]repository.WaiterSelfPerformanceWeeklyRow, error) {
	return s.q.WaiterSelfPerformanceWeekly(ctx, id)
}

func (s *Service) WaiterSelfPerformanceMonthly(ctx context.Context, id int32) ([]repository.WaiterSelfPerformanceMonthlyRow, error) {
	return s.q.WaiterSelfPerformanceMonthly(ctx, id)
}
