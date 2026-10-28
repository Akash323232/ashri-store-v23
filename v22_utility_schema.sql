-- V22 Utility Services + transaction-based 20-level commission
CREATE TABLE IF NOT EXISTS utility_services (
 id BIGSERIAL PRIMARY KEY, service_key TEXT UNIQUE NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL CHECK(category IN ('recharge','bill_payment','banking','money_transfer','travel','insurance','education','subscription','other')),
 description TEXT NOT NULL DEFAULT '', provider_code TEXT, mode TEXT NOT NULL DEFAULT 'api' CHECK(mode IN ('api','manual')), input_schema JSONB NOT NULL DEFAULT '[]'::jsonb,
 active BOOLEAN NOT NULL DEFAULT false, test_mode BOOLEAN NOT NULL DEFAULT true, created_by BIGINT REFERENCES users(id), updated_by BIGINT REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS utility_commission_rules (
 id BIGSERIAL PRIMARY KEY, service_id BIGINT NOT NULL REFERENCES utility_services(id), level_no INTEGER NOT NULL CHECK(level_no BETWEEN 1 AND 20), share_percent NUMERIC(7,4) NOT NULL CHECK(share_percent>=0 AND share_percent<=100), active BOOLEAN NOT NULL DEFAULT true,
 effective_from TIMESTAMPTZ NOT NULL DEFAULT now(), created_by BIGINT REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(service_id,level_no,effective_from)
);
CREATE TABLE IF NOT EXISTS utility_transactions (
 id BIGSERIAL PRIMARY KEY, transaction_ref TEXT UNIQUE NOT NULL, provider_transaction_ref TEXT UNIQUE, service_id BIGINT NOT NULL REFERENCES utility_services(id), customer_user_id BIGINT REFERENCES users(id), initiated_by BIGINT REFERENCES users(id), customer_input JSONB NOT NULL DEFAULT '{}'::jsonb,
 amount NUMERIC(12,2) NOT NULL CHECK(amount>0), provider_commission NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK(provider_commission>=0), currency CHAR(3) NOT NULL DEFAULT 'INR', status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','success','failed','reversed','disputed')),
 provider_status TEXT, provider_response JSONB NOT NULL DEFAULT '{}'::jsonb, idempotency_key TEXT UNIQUE NOT NULL, completed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS utility_commission_ledger (
 id BIGSERIAL PRIMARY KEY, transaction_id BIGINT NOT NULL REFERENCES utility_transactions(id), beneficiary_user_id BIGINT NOT NULL REFERENCES users(id), source_user_id BIGINT REFERENCES users(id), level_no INTEGER NOT NULL CHECK(level_no BETWEEN 1 AND 20), provider_commission NUMERIC(12,2) NOT NULL CHECK(provider_commission>=0), share_percent NUMERIC(7,4) NOT NULL CHECK(share_percent>=0 AND share_percent<=100), commission_amount NUMERIC(12,2) NOT NULL CHECK(commission_amount>=0), status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','paid','reversed','rejected')), payout_reference TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(transaction_id,beneficiary_user_id,level_no)
);
CREATE INDEX IF NOT EXISTS idx_utility_tx_member_date ON utility_transactions(initiated_by,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_utility_tx_status_date ON utility_transactions(status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_utility_commission_beneficiary ON utility_commission_ledger(beneficiary_user_id,status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_utility_rules_service_level ON utility_commission_rules(service_id,level_no,effective_from DESC);
