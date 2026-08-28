-- ==============================================================================
-- CIZ MARKET UGANDA - PRODUCTION POSTGRESQL DDL MIGRATION SCRIPT
-- Dialect: PostgreSQL 14+ / 16 (Native UUIDv4, B-Tree Indexes & Numeric Financial Precision)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- CUSTOM TYPE ENUMS
-- -----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM (
  'CUSTOMER', 'VENDOR', 'DELIVERY_AGENT', 'ADMIN', 'SUPER_ADMIN'
);

CREATE TYPE account_status AS ENUM (
  'PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED'
);

CREATE TYPE vendor_verification_status AS ENUM (
  'UNSUBMITTED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED'
);

CREATE TYPE product_status AS ENUM (
  'DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'OUT_OF_STOCK', 'ARCHIVED'
);

CREATE TYPE order_status AS ENUM (
  'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'READY_FOR_PICKUP', 
  'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 
  'RETURN_REQUESTED', 'RETURNED', 'DISPUTED'
);

CREATE TYPE payment_method AS ENUM (
  'MTN_MOMO', 'AIRTEL_MONEY', 'VISA_MASTERCARD', 'CASH_ON_DELIVERY', 'BANK_TRANSFER'
);

CREATE TYPE payment_status AS ENUM (
  'INITIATED', 'PENDING_USSD', 'SUCCESSFUL', 'FAILED', 'REVERSED', 'REFUNDED'
);

CREATE TYPE delivery_status AS ENUM (
  'UNASSIGNED', 'ASSIGNED', 'EN_ROUTE_PICKUP', 'PICKED_UP', 
  'IN_TRANSIT_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED', 
  'FAILED_ATTEMPT', 'RETURNED_TO_MERCHANT'
);

CREATE TYPE refund_status AS ENUM (
  'REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED'
);

CREATE TYPE discount_type AS ENUM (
  'PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'
);

CREATE TYPE ticket_priority AS ENUM (
  'LOW', 'MEDIUM', 'HIGH', 'URGENT'
);

CREATE TYPE ticket_status AS ENUM (
  'OPEN', 'IN_PROGRESS', 'AWAITING_CUSTOMER', 'RESOLVED', 'CLOSED'
);

-- -----------------------------------------------------------------------------
-- 1. USERS & IDENTITY
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(32) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  avatar_url VARCHAR(512),
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  status account_status NOT NULL DEFAULT 'ACTIVE',
  email_verified_at TIMESTAMPTZ,
  phone_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_users_phone ON users(phone_number);

-- -----------------------------------------------------------------------------
-- 2. VENDOR ECOSYSTEM & KYC
-- -----------------------------------------------------------------------------
CREATE TABLE vendor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  tin_number VARCHAR(50) NOT NULL UNIQUE, -- URA TIN
  business_registration_no VARCHAR(100),
  description TEXT,
  logo_url VARCHAR(512),
  banner_url VARCHAR(512),
  physical_address VARCHAR(300) NOT NULL,
  city_or_district VARCHAR(100) NOT NULL,
  support_phone VARCHAR(32) NOT NULL,
  support_email VARCHAR(255) NOT NULL,
  payout_phone VARCHAR(32) NOT NULL,
  payout_network VARCHAR(20) NOT NULL,
  payout_account_name VARCHAR(150) NOT NULL,
  commission_rate_pct NUMERIC(5, 2) NOT NULL DEFAULT 8.00,
  verification_status vendor_verification_status NOT NULL DEFAULT 'PENDING_REVIEW',
  rejection_reason TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vendors_status ON vendor_profiles(verification_status);
CREATE INDEX idx_vendors_district ON vendor_profiles(city_or_district);

CREATE TABLE vendor_verification_docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_profile_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_url VARCHAR(512) NOT NULL,
  document_number VARCHAR(100),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vendor_docs ON vendor_verification_docs(vendor_profile_id, document_type);

-- -----------------------------------------------------------------------------
-- 3. CATEGORIES, PRODUCTS & VARIANTS
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  icon_name VARCHAR(50),
  image_url VARCHAR(512),
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_active_order ON categories(is_active, display_order);

CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(512),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_cat_subcat_name UNIQUE (category_id, name)
);

CREATE INDEX idx_subcat_active ON subcategories(category_id, is_active);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_profile_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE RESTRICT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL UNIQUE,
  sku VARCHAR(64) NOT NULL UNIQUE,
  brand VARCHAR(100) NOT NULL DEFAULT 'Generic',
  short_description VARCHAR(500),
  description TEXT NOT NULL,
  base_price NUMERIC(12, 2) NOT NULL,
  discount_price NUMERIC(12, 2),
  stock_quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 5,
  weight_kg NUMERIC(6, 2),
  warranty_info VARCHAR(200),
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  status product_status NOT NULL DEFAULT 'PUBLISHED',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_flash_deal BOOLEAN NOT NULL DEFAULT FALSE,
  views_count INT NOT NULL DEFAULT 0,
  sales_count INT NOT NULL DEFAULT 0,
  average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  reviews_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_vendor_status ON products(vendor_profile_id, status);
CREATE INDEX idx_products_category ON products(category_id, status);
CREATE INDEX idx_products_pricing ON products(base_price);
CREATE INDEX idx_products_deals ON products(is_flash_deal, is_featured);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(512) NOT NULL,
  alt_text VARCHAR(200),
  is_thumbnail BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images ON product_images(product_id, display_order);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(64) NOT NULL UNIQUE,
  variant_name VARCHAR(100) NOT NULL,
  color_hex VARCHAR(10),
  size_or_spec VARCHAR(50),
  additional_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  stock_quantity INT NOT NULL DEFAULT 0,
  image_url VARCHAR(512),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_variants_prod_active ON product_variants(product_id, is_active);

-- -----------------------------------------------------------------------------
-- 4. CARTS & WISHLISTS
-- -----------------------------------------------------------------------------
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_cart_prod_variant UNIQUE (cart_id, product_id, product_variant_id)
);

CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL DEFAULT 'My Wishlist',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_wishlist_product UNIQUE (wishlist_id, product_id)
);

-- -----------------------------------------------------------------------------
-- 5. ADDRESSES & LOGISTICS ZONES
-- -----------------------------------------------------------------------------
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  region VARCHAR(80) NOT NULL,
  estimated_delivery VARCHAR(80) NOT NULL,
  base_delivery_fee NUMERIC(10, 2) NOT NULL,
  per_kg_additional_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES delivery_zones(id) ON DELETE RESTRICT,
  recipient_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(32) NOT NULL,
  district VARCHAR(100) NOT NULL,
  city_town VARCHAR(100) NOT NULL,
  street_address VARCHAR(255) NOT NULL,
  landmark VARCHAR(255) NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user ON addresses(user_id, is_default);

-- -----------------------------------------------------------------------------
-- 6. COUPONS, ORDERS & FROZEN ITEM FINANCIALS
-- -----------------------------------------------------------------------------
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(32) NOT NULL UNIQUE,
  description VARCHAR(255),
  discount_type discount_type NOT NULL DEFAULT 'PERCENTAGE',
  discount_value NUMERIC(10, 2) NOT NULL,
  min_purchase_ugx NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  max_discount_ugx NUMERIC(12, 2),
  usage_limit INT,
  usage_count INT NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(32) NOT NULL UNIQUE,
  tracking_number VARCHAR(40) NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  delivery_address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  
  -- Frozen Ledger Totals
  subtotal_amount NUMERIC(12, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(12, 2) NOT NULL,
  
  order_status order_status NOT NULL DEFAULT 'PENDING_PAYMENT',
  payment_status payment_status NOT NULL DEFAULT 'INITIATED',
  payment_method payment_method NOT NULL DEFAULT 'MTN_MOMO',
  
  recipient_snapshot JSONB NOT NULL,
  customer_notes TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customer_status ON orders(customer_id, order_status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_tracking ON orders(tracking_number);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  vendor_profile_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  
  -- Immutable Pricing & Commission Snapshot
  product_title VARCHAR(255) NOT NULL,
  product_sku VARCHAR(64) NOT NULL,
  variant_name VARCHAR(100),
  unit_price NUMERIC(12, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_price NUMERIC(12, 2) NOT NULL,
  vendor_commission_pct NUMERIC(5, 2) NOT NULL,
  vendor_earning_amount NUMERIC(12, 2) NOT NULL,
  is_refunded BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_vendor ON order_items(vendor_profile_id);

CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  note VARCHAR(255),
  changed_by VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 7. TRANSACTIONS, WEBHOOKS & VENDOR PAYOUTS
-- -----------------------------------------------------------------------------
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  transaction_ref VARCHAR(100) NOT NULL UNIQUE,
  external_gateway_ref VARCHAR(128) UNIQUE,
  provider payment_method NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'UGX',
  payer_phone_number VARCHAR(32),
  status payment_status NOT NULL DEFAULT 'INITIATED',
  gateway_status_code VARCHAR(50),
  gateway_message TEXT,
  raw_gateway_response JSONB,
  initiated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_payments_order ON payment_transactions(order_id);
CREATE INDEX idx_payments_status ON payment_transactions(status);

CREATE TABLE payment_webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_transaction_id UUID REFERENCES payment_transactions(id) ON DELETE SET NULL,
  provider payment_method NOT NULL,
  webhook_event_type VARCHAR(100) NOT NULL,
  idempotency_key VARCHAR(150) NOT NULL UNIQUE,
  payload JSONB NOT NULL,
  signature_header VARCHAR(512),
  is_signature_valid BOOLEAN NOT NULL DEFAULT FALSE,
  is_processed BOOLEAN NOT NULL DEFAULT FALSE,
  processing_error TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_webhooks_idempotency ON payment_webhook_logs(idempotency_key);
CREATE INDEX idx_webhooks_status ON payment_webhook_logs(provider, is_processed);

CREATE TABLE vendor_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_profile_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE RESTRICT,
  payout_reference VARCHAR(100) NOT NULL UNIQUE,
  gross_sales_amount NUMERIC(12, 2) NOT NULL,
  commission_deducted NUMERIC(12, 2) NOT NULL,
  net_disbursed_amount NUMERIC(12, 2) NOT NULL,
  payout_method VARCHAR(50) NOT NULL DEFAULT 'MTN_MOMO_DISBURSEMENT',
  recipient_phone VARCHAR(32) NOT NULL,
  disbursement_ref VARCHAR(128),
  status payment_status NOT NULL DEFAULT 'INITIATED',
  scheduled_date DATE NOT NULL,
  disbursed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payouts_vendor ON vendor_payouts(vendor_profile_id, status);

-- -----------------------------------------------------------------------------
-- 8. AGENT DISPATCH, REVIEWS, REFUNDS, TICKETS & AUDITING
-- -----------------------------------------------------------------------------
CREATE TABLE delivery_agent_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type VARCHAR(60) NOT NULL DEFAULT 'Boda-Boda (Bajaj Boxer)',
  vehicle_plate_no VARCHAR(30) NOT NULL UNIQUE,
  national_id_number VARCHAR(50) NOT NULL UNIQUE,
  driving_permit_no VARCHAR(50),
  assigned_hub VARCHAR(100) NOT NULL DEFAULT 'Kampala Central Hub',
  current_latitude NUMERIC(10, 7),
  current_longitude NUMERIC(10, 7),
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delivery_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  delivery_agent_id UUID NOT NULL REFERENCES delivery_agent_profiles(id) ON DELETE RESTRICT,
  status delivery_status NOT NULL DEFAULT 'ASSIGNED',
  pickup_landmark VARCHAR(255),
  dropoff_landmark VARCHAR(255) NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  recipient_signature_url VARCHAR(512),
  delivery_notes TEXT
);

CREATE INDEX idx_delivery_order ON delivery_assignments(order_id, status);
CREATE INDEX idx_delivery_agent ON delivery_assignments(delivery_agent_id, status);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(120),
  comment TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_product_user_review UNIQUE (product_id, user_id)
);

CREATE TABLE refund_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  refund_number VARCHAR(32) NOT NULL UNIQUE,
  reason VARCHAR(255) NOT NULL,
  details TEXT,
  requested_amount NUMERIC(12, 2) NOT NULL,
  refunded_amount NUMERIC(12, 2),
  payout_method payment_method NOT NULL DEFAULT 'MTN_MOMO',
  payout_phone VARCHAR(32) NOT NULL,
  reversal_ref VARCHAR(128),
  status refund_status NOT NULL DEFAULT 'REQUESTED',
  reviewed_by_admin VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMPTZ
);

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number VARCHAR(32) NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  subject VARCHAR(200) NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'MEDIUM',
  status ticket_status NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  link_url VARCHAR(255),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(60) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  changes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_action_time ON audit_logs(action, created_at);
