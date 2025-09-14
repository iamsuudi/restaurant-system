-- name: GetCompletedOrdersDaily :many
SELECT *
FROM "order"
WHERE status = 'delivered'
  AND DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- name: CountCompletedOrdersDaily :one
SELECT COUNT(*) AS total
FROM "order"
WHERE status = 'delivered'
  AND DATE(created_at) = CURRENT_DATE;


-- name: GetCompletedOrdersWeekly :many
SELECT *
FROM "order"
WHERE status = 'delivered'
  AND DATE_TRUNC('week', created_at) = DATE_TRUNC('week', CURRENT_DATE)
ORDER BY created_at DESC;

-- name: CountCompletedOrdersWeekly :one
SELECT COUNT(*) AS total
FROM "order"
WHERE status = 'delivered'
  AND DATE_TRUNC('week', created_at) = DATE_TRUNC('week', CURRENT_DATE);


-- name: GetCompletedOrdersMonthly :many
SELECT *
FROM "order"
WHERE status = 'delivered'
  AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY created_at DESC;

-- name: CountCompletedOrdersMonthly :one
SELECT COUNT(*) AS total
FROM "order"
WHERE status = 'delivered'
  AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);


-- name: OrdersByCategoryDaily :many
SELECT date_trunc('day', oi.created_at)::timestamptz AS period,
       oi.category,
       SUM(oi.quantity) AS total_sold,
       SUM(oi.price * oi.quantity)::double precision AS revenue
FROM order_item oi
GROUP BY period, oi.category
ORDER BY period, total_sold DESC
LIMIT 30;

-- name: OrdersByCategoryWeekly :many
SELECT date_trunc('week', oi.created_at)::timestamptz AS period,
       oi.category,
       SUM(oi.quantity) AS total_sold,
       SUM(oi.price * oi.quantity)::double precision AS revenue
FROM order_item oi
GROUP BY period, oi.category
ORDER BY period, total_sold DESC;

-- name: OrdersByCategoryMonthly :many
SELECT date_trunc('month', oi.created_at)::timestamptz AS period,
       oi.category,
       SUM(oi.quantity) AS total_sold,
       SUM(oi.price * oi.quantity)::double precision AS revenue
FROM order_item oi
GROUP BY period, oi.category
ORDER BY period, total_sold DESC;
