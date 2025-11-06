-- ============================================
-- ROLES TABLE
-- ============================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE NOT NULL,
    permissions TEXT
);

-- ============================================
-- GYMS TABLE
-- ============================================
CREATE TABLE gyms (
    gym_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    owner_id INT,
    opening_hours TEXT
);

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    join_date DATE DEFAULT CURRENT_DATE,
    address TEXT,
    role_id INT REFERENCES roles(role_id),
    gym_id INT REFERENCES gyms(gym_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE gyms 
ADD CONSTRAINT fk_gym_owner FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE SET NULL;

-- ============================================
-- MEMBERSHIPS TABLE
-- ============================================
CREATE TABLE memberships (
    membership_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    plan_type VARCHAR(50) CHECK (plan_type IN ('daily', 'monthly', '3-month', 'yearly')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    gym_id INT REFERENCES gyms(gym_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TRAINERS TABLE
-- ============================================
CREATE TABLE trainers (
    trainer_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    specialization VARCHAR(100),
    certifications TEXT,
    hire_date DATE,
    hourly_rate NUMERIC(10,2),
    employment_type VARCHAR(20) DEFAULT 'full-time',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CLASSES TABLE
-- ============================================
CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    trainer_id INT REFERENCES trainers(trainer_id),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    class_date DATE,
    capacity INT,
    gym_id INT REFERENCES gyms(gym_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ATTENDANCES TABLE
-- ============================================
CREATE TABLE attendances (
    attendance_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    class_id INT REFERENCES classes(class_id) ON DELETE SET NULL,
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    membership_id INT REFERENCES memberships(membership_id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TRAINER PAYROLL TABLE
-- ============================================
CREATE TABLE trainer_payrolls (
    payroll_id SERIAL PRIMARY KEY,
    trainer_id INT REFERENCES trainers(trainer_id) ON DELETE CASCADE,
    month_year VARCHAR(7),
    total_hours NUMERIC(10,2),
    total_pay NUMERIC(10,2),
    paid_status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TELEGRAM NOTIFICATIONS TABLE
-- ============================================
-- CREATE TABLE telegram_notifications (
--     notification_id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
--     chat_id VARCHAR(50),
--     message TEXT,
--     status VARCHAR(20) DEFAULT 'pending',
--     sent_at TIMESTAMP,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- ============================================
-- TRIGGERS TO AUTO-UPDATE TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_update
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_memberships_update
BEFORE UPDATE ON memberships
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_trainers_update
BEFORE UPDATE ON trainers
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_classes_update
BEFORE UPDATE ON classes
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_payments_update
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_trainerpayrolls_update
BEFORE UPDATE ON trainer_payrolls
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- CREATE TRIGGER trg_telegram_notifications_update
-- BEFORE UPDATE ON telegram_notifications
-- FOR EACH ROW EXECUTE FUNCTION update_timestamp();

COMMIT;
