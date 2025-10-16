CREATE TABLE IF NOT EXISTS tours (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    price_formatted VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    image_url TEXT,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tours_country ON tours(country);
CREATE INDEX idx_tours_category ON tours(category);
CREATE INDEX idx_tours_price ON tours(price);