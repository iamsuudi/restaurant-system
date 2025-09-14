-- name: WaiterPerformanceDaily :many
SELECT u.id,
       u.name,
       u.picture,
       date_trunc('day', al.ts)::timestamptz AS period,
       COUNT(*) FILTER (WHERE al.action_type = 'CREATE_ORDER') AS created_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER') AS updated_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER_STATUS') AS status_updates,
       COUNT(*) AS total_actions
FROM activity_log al
JOIN "user" u ON u.id = al.actor_id
WHERE u.role = 'waiter'
  AND al.action_type IN ('CREATE_ORDER', 'UPDATE_ORDER', 'UPDATE_ORDER_STATUS')
GROUP BY u.id, u.name, period
ORDER BY period, total_actions DESC;

-- name: WaiterPerformanceWeekly :many
SELECT u.id,
       u.name,
       u.picture,
       date_trunc('week', al.ts)::timestamptz AS period,
       COUNT(*) FILTER (WHERE al.action_type = 'CREATE_ORDER') AS created_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER') AS updated_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER_STATUS') AS status_updates,
       COUNT(*) AS total_actions
FROM activity_log al
JOIN "user" u ON u.id = al.actor_id
WHERE u.role = 'waiter'
  AND al.action_type IN ('CREATE_ORDER', 'UPDATE_ORDER', 'UPDATE_ORDER_STATUS')
GROUP BY u.id, u.name, period
ORDER BY period, total_actions DESC;

-- name: WaiterPerformanceMonthly :many
SELECT u.id,
       u.name,
       u.picture,
       date_trunc('month', al.ts)::timestamptz AS period,
       COUNT(*) FILTER (WHERE al.action_type = 'CREATE_ORDER') AS created_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER') AS updated_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER_STATUS') AS status_updates,
       COUNT(*) AS total_actions
FROM activity_log al
JOIN "user" u ON u.id = al.actor_id
WHERE u.role = 'waiter'
  AND al.action_type IN ('CREATE_ORDER', 'UPDATE_ORDER', 'UPDATE_ORDER_STATUS')
GROUP BY u.id, u.name, period
ORDER BY period, total_actions DESC;

-- name: WaiterPerformanceSummary :many
SELECT u.id,
       u.name,
       u.picture,
       COUNT(*) FILTER (WHERE al.action_type = 'CREATE_ORDER') AS created_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER') AS updated_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER_STATUS') AS status_updates,
       COUNT(*) AS total_actions
FROM "user" u
LEFT JOIN activity_log al ON u.id = al.actor_id
  AND al.action_type IN ('CREATE_ORDER', 'UPDATE_ORDER', 'UPDATE_ORDER_STATUS')
WHERE u.role = 'waiter'
GROUP BY u.id, u.name
ORDER BY total_actions DESC;

-- name: WaiterSelfPerformanceDaily :many
SELECT date_trunc('day', al.ts)::timestamptz AS period,
       COUNT(*) FILTER (WHERE al.action_type = 'CREATE_ORDER') AS created_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER') AS updated_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER_STATUS') AS status_updates,
       COUNT(*) AS total_actions
FROM activity_log al
WHERE al.actor_id = $1
  AND al.action_type IN ('CREATE_ORDER', 'UPDATE_ORDER', 'UPDATE_ORDER_STATUS')
GROUP BY period
ORDER BY period;

-- name: WaiterSelfPerformanceWeekly :many
SELECT date_trunc('week', al.ts)::timestamptz AS period,
       COUNT(*) FILTER (WHERE al.action_type = 'CREATE_ORDER') AS created_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER') AS updated_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER_STATUS') AS status_updates,
       COUNT(*) AS total_actions
FROM activity_log al
WHERE al.actor_id = $1
  AND al.action_type IN ('CREATE_ORDER', 'UPDATE_ORDER', 'UPDATE_ORDER_STATUS')
GROUP BY period
ORDER BY period;

-- name: WaiterSelfPerformanceMonthly :many
SELECT date_trunc('month', al.ts)::timestamptz AS period,
       COUNT(*) FILTER (WHERE al.action_type = 'CREATE_ORDER') AS created_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER') AS updated_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER_STATUS') AS status_updates,
       COUNT(*) AS total_actions
FROM activity_log al
WHERE al.actor_id = $1
  AND al.action_type IN ('CREATE_ORDER', 'UPDATE_ORDER', 'UPDATE_ORDER_STATUS')
GROUP BY period
ORDER BY period;

-- name: WaiterSelfPerformanceSummary :one
SELECT COUNT(*) FILTER (WHERE al.action_type = 'CREATE_ORDER') AS created_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER') AS updated_orders,
       COUNT(*) FILTER (WHERE al.action_type = 'UPDATE_ORDER_STATUS') AS status_updates,
       COUNT(*) AS total_actions
FROM activity_log al
WHERE al.actor_id = $1
  AND al.action_type IN ('CREATE_ORDER', 'UPDATE_ORDER', 'UPDATE_ORDER_STATUS');
