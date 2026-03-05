create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  username text unique not null,
  password_hash text not null,
  role text default 'user',
  created_at timestamp with time zone default now()
);

-- for better lookup
CREATE UNIQUE INDEX idx_users_email_lower ON users (email);
CREATE UNIQUE INDEX idx_users_username_lower ON users (username);