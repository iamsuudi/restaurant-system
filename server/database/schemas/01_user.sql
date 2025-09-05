CREATE TABLE "user" (
    id               SERIAL PRIMARY KEY,
    name             TEXT NOT NULL,
    email            TEXT UNIQUE NOT NULL,
    phone            TEXT NOT NULL,
    role             TEXT NOT NULL,
    picture          TEXT,

    created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP(3)
);

CREATE TABLE account (
    id              SERIAL PRIMARY KEY,
    password_hash   TEXT    NOT NULL,
    user_id         INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    created_at      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP(3)
);
