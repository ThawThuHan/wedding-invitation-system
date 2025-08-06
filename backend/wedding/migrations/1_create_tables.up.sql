CREATE TABLE weddings (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  wedding_date TIMESTAMP NOT NULL,
  venue TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE guests (
  id BIGSERIAL PRIMARY KEY,
  wedding_id BIGINT NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  plus_one_allowed BOOLEAN DEFAULT FALSE,
  invited_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rsvps (
  id BIGSERIAL PRIMARY KEY,
  guest_id BIGINT NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  attending BOOLEAN NOT NULL,
  plus_one_attending BOOLEAN DEFAULT FALSE,
  dietary_restrictions TEXT,
  message TEXT,
  responded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_guests_wedding_id ON guests(wedding_id);
CREATE INDEX idx_rsvps_guest_id ON rsvps(guest_id);
CREATE UNIQUE INDEX idx_rsvps_guest_unique ON rsvps(guest_id);
