-- name: TotalRevenue :one
SELECT COALESCE(SUM(oi.price * oi.quantity), 0) AS total_revenue
FROM order_item oi;

-- name: OrdersAndRevenueDaily :many
SELECT date_trunc('day', oi.created_at)::timestamptz AS period,
       COUNT(DISTINCT oi.order_id) AS total_orders,
       SUM(oi.price * oi.quantity)::double precision AS total_revenue
FROM order_item oi
GROUP BY period
ORDER BY period;

-- name: OrdersAndRevenueWeekly :many
SELECT date_trunc('week', oi.created_at)::timestamptz AS period,
       COUNT(DISTINCT oi.order_id) AS total_orders,
       SUM(oi.price * oi.quantity)::double precision AS total_revenue
FROM order_item oi
GROUP BY period
ORDER BY period;

-- name: OrdersAndRevenueMonthly :many
SELECT date_trunc('month', oi.created_at)::timestamptz AS period,
       COUNT(DISTINCT oi.order_id) AS total_orders,
       SUM(oi.price * oi.quantity)::double precision AS total_revenue
FROM order_item oi
GROUP BY period
ORDER BY period;
