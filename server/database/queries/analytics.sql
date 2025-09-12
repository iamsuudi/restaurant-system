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



-- name: AvgPreparationTimeDaily :one
SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (delivered_at - created_at))), 0) AS avg_prep_seconds
FROM "order"
WHERE status = 'DELIVERED'
AND DATE(created_at) = CURRENT_DATE;

-- name: AvgPreparationTimeWeekly :one
SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (delivered_at - created_at))), 0) AS avg_prep_seconds
FROM "order"
WHERE status = 'DELIVERED'
AND DATE_TRUNC('week', created_at) = DATE_TRUNC('week', CURRENT_DATE);

-- name: AvgPreparationTimeMonthly :one
SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (delivered_at - created_at))), 0) AS avg_prep_seconds
FROM "order"
WHERE status = 'DELIVERED'
AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);
