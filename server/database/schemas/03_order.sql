CREATE TABLE "order" (
    id               SERIAL PRIMARY KEY,
    waiter_id        INTEGER REFERENCES "user"(id),
    status           VARCHAR(255) NOT NULL DEFAULT 'PENDING',
    table_number     VARCHAR(5) NOT NULL,
    note             TEXT,
    total_price      FLOAT NOT NULL,
    created_at       TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    delivered_at     TIMESTAMP(3),
    updated_at       TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE TABLE order_item (
    id               SERIAL PRIMARY KEY,
    order_id         INTEGER NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
    menu_item_id     INTEGER NOT NULL REFERENCES "menu_item"(id),
    quantity         INTEGER NOT NULL DEFAULT 1,
    price            FLOAT NOT NULL,
    category         VARCHAR(20) NOT NULL,
    created_at       TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP(3) NOT NULL DEFAULT NOW()
);
