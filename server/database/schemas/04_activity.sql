CREATE TABLE activity_log (
    id                  SERIAL PRIMARY KEY,
    actor_id            INTEGER NOT NULL REFERENCES "user"(id) ON DELETE SET NULL,
    target_user_id      INTEGER REFERENCES "user"(id)          ON DELETE SET NULL,
    target_user_name    TEXT,
    target_menu_id      INTEGER REFERENCES menu_item(id)       ON DELETE SET NULL,
    target_menu_name    TEXT,
    target_order_id     INTEGER REFERENCES "order"(id)         ON DELETE SET NULL,
    action_type         TEXT NOT NULL,
    object_type         TEXT NOT NULL,
    diff                JSONB,
    ts                  TIMESTAMPTZ(3) NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_actor            ON activity_log(actor_id);
CREATE INDEX idx_audit_target_user      ON activity_log(target_user_id);
CREATE INDEX idx_audit_target_menu      ON activity_log(target_menu_id);
CREATE INDEX idx_audit_target_order     ON activity_log(target_order_id);
CREATE INDEX idx_audit_ts               ON activity_log(ts DESC);
