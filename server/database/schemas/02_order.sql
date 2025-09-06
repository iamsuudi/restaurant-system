CREATE TABLE menu_item (
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    description      TEXT,
    price            DECIMAL(10, 2) NOT NULL,
    picture          TEXT NOT NULL,
    status           BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE TABLE "order" (
    id               SERIAL PRIMARY KEY,
    waiter_id        INTEGER REFERENCES "user"(id),
    status           VARCHAR(255) NOT NULL DEFAULT 'PENDING',
    table_number     TEXT,
    created_at       TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE TABLE order_item (
    id               SERIAL PRIMARY KEY,
    order_id         INTEGER NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
    menu_item_id     INTEGER NOT NULL REFERENCES "menu_item"(id),
    quantity         INTEGER NOT NULL DEFAULT 1,
    created_at       TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP(3) NOT NULL DEFAULT NOW()
);
