-- Run after server/schema.sql and server/v22_utility_schema.sql.
ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_users_whatsapp_opt_in ON users(whatsapp_opt_in) WHERE whatsapp_opt_in=true;
