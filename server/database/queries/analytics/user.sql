-- name: TopActiveUsers :many
SELECT u.id,
       u.name,
       u.role,
       u.picture,
       COUNT(*) AS total_actions
FROM activity_log al
JOIN "user" u ON u.id = al.actor_id
GROUP BY u.id, u.name, u.role
ORDER BY total_actions DESC
LIMIT 10;
