-- Password reset tokens table
CREATE TABLE password_reset_tokens (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    token       TEXT NOT NULL UNIQUE,
    expires_at  TIMESTAMP(3) NOT NULL,
    created_at  TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    used_at     TIMESTAMP(3),
    CONSTRAINT valid_token CHECK (expires_at > created_at)
);
