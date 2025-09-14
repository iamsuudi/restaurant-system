-- name: TopSellingItems :many
SELECT mi.id,
       mi.name,
       SUM(oi.quantity) AS total_sold,
       SUM(oi.price * oi.quantity)::double precision AS revenue
FROM order_item oi
JOIN menu_item mi ON mi.id = oi.menu_item_id
GROUP BY mi.id, mi.name
ORDER BY total_sold DESC
LIMIT 10;
