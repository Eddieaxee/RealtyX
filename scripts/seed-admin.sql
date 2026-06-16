-- Seed admin credentials directly into SQLite
INSERT OR IGNORE INTO users (id, email, name, password, role, status, created_at, updated_at)
VALUES (
  'cm_admin_001',
  'admin@realtyx.io',
  'Admin',
  '$2a$12$LJ3m4ys3Lk0TSwHnbfOMaO2T1y3PF.VXxVHpJBPqVcGJYVBQvQbSq',
  'ADMIN',
  'ACTIVE',
  datetime('now'),
  datetime('now')
);

INSERT OR IGNORE INTO users (id, email, name, password, role, status, created_at, updated_at)
VALUES (
  'cm_user_001',
  'user@example.com',
  'John Investor',
  '$2a$12$LJ3m4ys3Lk0TSwHnbfOMaO2T1y3PF.VXxVHpJBPqVcGJYVBQvQbSq',
  'USER',
  'ACTIVE',
  datetime('now'),
  datetime('now')
);