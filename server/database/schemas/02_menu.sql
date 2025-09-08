CREATE TABLE menu_item (
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    description      TEXT,
    price            DECIMAL(10, 2) NOT NULL,
    picture          TEXT NOT NULL,
    category         VARCHAR(20) NOT NULL,
    status           BOOLEAN NOT NULL DEFAULT FALSE,
    ingredients      TEXT[],
    created_at       TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP(3) NOT NULL DEFAULT NOW()
);
