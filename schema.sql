CREATE TABLE IF NOT EXISTS users (
 id BIGSERIAL PRIMARY KEY,
 member_code TEXT UNIQUE NOT NULL,
 full_name TEXT NOT NULL,
 email TEXT UNIQUE NOT NULL,
 mobile TEXT UNIQUE,
 password_hash TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('super_admin','admin','member','support_staff')),
 status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','suspended','rejected')),
 referral_code TEXT UNIQUE NOT NULL,
 referred_by BIGINT REFERENCES users(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS affiliate_policies (
 id BIGSERIAL PRIMARY KEY,
 enabled BOOLEAN NOT NULL DEFAULT false,
 commission_type TEXT NOT NULL DEFAULT 'percentage' CHECK (commission_type IN ('percentage','fixed')),
 commission_value NUMERIC(12,2) NOT NULL DEFAULT 5 CHECK (commission_value >= 0),
 min_sale NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (min_sale >= 0),
 hold_days INTEGER NOT NULL DEFAULT 7 CHECK (hold_days >= 0),
 effective_from TIMESTAMPTZ NOT NULL DEFAULT now(),
 created_by BIGINT REFERENCES users(id),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS orders (
 id BIGSERIAL PRIMARY KEY,
 order_ref TEXT UNIQUE NOT NULL,
 customer_id BIGINT REFERENCES users(id),
 referred_by BIGINT REFERENCES users(id),
 gross_amount NUMERIC(12,2) NOT NULL CHECK (gross_amount >= 0),
 eligible_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (eligible_amount >= 0),
 payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded','cancelled')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 paid_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS commission_ledger (
 id BIGSERIAL PRIMARY KEY,
 order_id BIGINT UNIQUE NOT NULL REFERENCES orders(id),
 member_id BIGINT NOT NULL REFERENCES users(id),
 policy_id BIGINT REFERENCES affiliate_policies(id),
 eligible_sale NUMERIC(12,2) NOT NULL,
 commission_amount NUMERIC(12,2) NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','paid','reversed')),
 reviewed_by BIGINT REFERENCES users(id),
 review_note TEXT,
 payout_reference TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS family_support_applications (
 id BIGSERIAL PRIMARY KEY,
 application_ref TEXT UNIQUE NOT NULL,
 member_id BIGINT NOT NULL REFERENCES users(id),
 requested_amount NUMERIC(12,2) NOT NULL CHECK (requested_amount > 0),
 reason TEXT NOT NULL,
 consent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected','disbursed')),
 decision_by BIGINT REFERENCES users(id),
 decision_note TEXT,
 approved_amount NUMERIC(12,2),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_logs (
 id BIGSERIAL PRIMARY KEY,
 actor_id BIGINT REFERENCES users(id),
 action TEXT NOT NULL,
 entity_type TEXT NOT NULL,
 entity_id TEXT,
 details JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);
CREATE INDEX IF NOT EXISTS idx_orders_referrer ON orders(referred_by, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commission_member_status ON commission_ledger(member_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_member_status ON family_support_applications(member_id, status, created_at DESC);

-- V18: admin business modules (all amounts are numeric; destructive deletes avoided for financial records)
CREATE TABLE IF NOT EXISTS categories (id BIGSERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL, description TEXT NOT NULL DEFAULT '', active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS products (id BIGSERIAL PRIMARY KEY, category_id BIGINT REFERENCES categories(id), sku TEXT UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', price NUMERIC(12,2) NOT NULL CHECK(price>=0), stock_qty INTEGER NOT NULL DEFAULT 0 CHECK(stock_qty>=0), active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS order_items (id BIGSERIAL PRIMARY KEY, order_id BIGINT NOT NULL REFERENCES orders(id), product_id BIGINT REFERENCES products(id), product_name TEXT NOT NULL, quantity INTEGER NOT NULL CHECK(quantity>0), unit_price NUMERIC(12,2) NOT NULL CHECK(unit_price>=0));
CREATE TABLE IF NOT EXISTS refunds (id BIGSERIAL PRIMARY KEY, order_id BIGINT NOT NULL REFERENCES orders(id), amount NUMERIC(12,2) NOT NULL CHECK(amount>0), reason TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'requested' CHECK(status IN ('requested','approved','rejected','processed')), reviewed_by BIGINT REFERENCES users(id), payment_reference TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS membership_plans (id BIGSERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL, price NUMERIC(12,2) NOT NULL CHECK(price>=0), duration_days INTEGER NOT NULL CHECK(duration_days>0), eligibility_rules JSONB NOT NULL DEFAULT '{}'::jsonb, active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS payout_requests (id BIGSERIAL PRIMARY KEY, member_id BIGINT NOT NULL REFERENCES users(id), amount NUMERIC(12,2) NOT NULL CHECK(amount>0), payment_method TEXT NOT NULL, payment_details JSONB NOT NULL DEFAULT '{}'::jsonb, status TEXT NOT NULL DEFAULT 'requested' CHECK(status IN ('requested','approved','rejected','paid')), reviewed_by BIGINT REFERENCES users(id), payment_reference TEXT, note TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS family_support_settings (id BIGSERIAL PRIMARY KEY, enabled BOOLEAN NOT NULL DEFAULT false, eligibility_rules JSONB NOT NULL DEFAULT '{}'::jsonb, max_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK(max_amount>=0), updated_by BIGINT REFERENCES users(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS support_tickets (id BIGSERIAL PRIMARY KEY, ticket_ref TEXT UNIQUE NOT NULL, member_id BIGINT REFERENCES users(id), subject TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_progress','resolved','closed')), assigned_to BIGINT REFERENCES users(id), response TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS notifications (id BIGSERIAL PRIMARY KEY, user_id BIGINT REFERENCES users(id), title TEXT NOT NULL, message TEXT NOT NULL, read_at TIMESTAMPTZ, created_by BIGINT REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS site_content (id BIGSERIAL PRIMARY KEY, content_key TEXT UNIQUE NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, published BOOLEAN NOT NULL DEFAULT false, updated_by BIGINT REFERENCES users(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS system_settings (setting_key TEXT PRIMARY KEY, setting_value JSONB NOT NULL, updated_by BIGINT REFERENCES users(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS role_permissions (id BIGSERIAL PRIMARY KEY, role TEXT NOT NULL CHECK(role IN ('super_admin','admin','member','support_staff')), permission TEXT NOT NULL, allowed BOOLEAN NOT NULL DEFAULT false, updated_by BIGINT REFERENCES users(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(role,permission));
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_date ON orders(payment_status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payout_status ON payout_requests(status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);


-- V20: configurable business plan packages, levels and GST calculation
CREATE TABLE IF NOT EXISTS business_plan_packages (
 id BIGSERIAL PRIMARY KEY, package_key TEXT UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
 base_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK(base_price>=0), gst_percent NUMERIC(5,2) NOT NULL DEFAULT 18 CHECK(gst_percent>=0 AND gst_percent<=100),
 active BOOLEAN NOT NULL DEFAULT true, is_free BOOLEAN NOT NULL DEFAULT false, eligibility_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_by BIGINT REFERENCES users(id), updated_by BIGINT REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS business_plan_levels (
 id BIGSERIAL PRIMARY KEY, package_id BIGINT NOT NULL REFERENCES business_plan_packages(id) ON DELETE CASCADE, level_no INTEGER NOT NULL CHECK(level_no BETWEEN 1 AND 20),
 level_name TEXT NOT NULL, qualifying_ids INTEGER NOT NULL DEFAULT 0 CHECK(qualifying_ids>=0), reward_type TEXT NOT NULL DEFAULT 'cash' CHECK(reward_type IN ('cash','product','status','none')),
 reward_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK(reward_amount>=0), reward_label TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '', active BOOLEAN NOT NULL DEFAULT true, updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(package_id,level_no)
);
CREATE INDEX IF NOT EXISTS idx_plan_levels_package ON business_plan_levels(package_id,level_no);
INSERT INTO business_plan_packages(package_key,name,description,base_price,gst_percent,active,is_free) VALUES
 ('free','Free ID Package','Free registration; rewards are configurable and not guaranteed.',0,18,true,true),
 ('starter','Starter Package','Base price ₹1,000 plus 18% GST.',1000,18,true,false),
 ('business','Business Package','Base price ₹25,000 plus 18% GST.',25000,18,true,false)
ON CONFLICT(package_key) DO NOTHING;
INSERT INTO business_plan_levels(package_id,level_no,level_name,qualifying_ids,reward_type,reward_amount,reward_label,notes)
SELECT p.id,v.level_no,v.level_name,v.qualifying_ids,'none',0,v.reward_label,'Admin must configure eligibility and reward before publishing.'
FROM business_plan_packages p CROSS JOIN (VALUES
 (1,'First Level',100,''),(2,'Second Level',1000,''),(3,'Third Level',10000,''),(4,'Fourth Level',100000,''),(5,'Fifth Level',1000000,''),(6,'Defender',0,'Defender status/reward'),(7,'Villa',0,'Villa status/reward')
) AS v(level_no,level_name,qualifying_ids,reward_label) WHERE p.package_key='free' ON CONFLICT(package_id,level_no) DO NOTHING;
