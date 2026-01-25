CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(50) NOT NULL,
  condition VARCHAR(30) NOT NULL,
  price INT NOT NULL CHECK (price >= 0),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  image TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);