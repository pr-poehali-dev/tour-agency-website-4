ALTER TABLE t_p30865444_tour_agency_website_.tours 
ADD COLUMN IF NOT EXISTS nights INTEGER DEFAULT 7,
ADD COLUMN IF NOT EXISTS departure VARCHAR(100) DEFAULT 'Москва',
ADD COLUMN IF NOT EXISTS dates VARCHAR(100),
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS hotel VARCHAR(255),
ADD COLUMN IF NOT EXISTS hotel_stars INTEGER DEFAULT 4,
ADD COLUMN IF NOT EXISTS included TEXT[],
ADD COLUMN IF NOT EXISTS meal VARCHAR(50) DEFAULT 'Завтрак',
ADD COLUMN IF NOT EXISTS flight_included BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_price INTEGER;

CREATE INDEX IF NOT EXISTS idx_tours_category ON t_p30865444_tour_agency_website_.tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_price ON t_p30865444_tour_agency_website_.tours(price);
CREATE INDEX IF NOT EXISTS idx_tours_destination ON t_p30865444_tour_agency_website_.tours(destination);
CREATE INDEX IF NOT EXISTS idx_tours_rating ON t_p30865444_tour_agency_website_.tours(rating);

UPDATE t_p30865444_tour_agency_website_.tours 
SET 
  nights = CAST(SUBSTRING(duration FROM '[0-9]+') AS INTEGER),
  rating = 4.5 + (RANDOM() * 0.4),
  reviews = FLOOR(50 + RANDOM() * 200)::INTEGER,
  hotel_stars = CASE 
    WHEN price > 200000 THEN 5
    WHEN price > 100000 THEN 4
    ELSE 3
  END,
  included = ARRAY['Перелёт', 'Проживание', 'Трансфер', 'Страховка']
WHERE nights IS NULL;