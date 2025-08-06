ALTER TABLE weddings ADD COLUMN hero_photo_url TEXT;
ALTER TABLE weddings ADD COLUMN place_details TEXT;
ALTER TABLE weddings ADD COLUMN template_id TEXT DEFAULT 'classic';
ALTER TABLE weddings ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE weddings ADD COLUMN webpage_slug TEXT UNIQUE;

CREATE TABLE wedding_photos (
  id BIGSERIAL PRIMARY KEY,
  wedding_id BIGINT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wedding_photos_wedding_id ON wedding_photos(wedding_id);
CREATE INDEX idx_wedding_photos_order ON wedding_photos(wedding_id, display_order);
