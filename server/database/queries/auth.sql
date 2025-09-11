-- name: CreateAccount :exec
INSERT INTO account (user_id, password_hash)
VALUES ($1, $2);

-- name: GetAccount :one
SELECT * FROM account
WHERE account.user_id = $1;

-- name: BlockAccount :exec
UPDATE account
SET blocked = TRUE
WHERE account.user_id = $1;

-- name: UnblockAccount :exec
UPDATE account
SET blocked = FALSE
WHERE account.user_id = $1;
