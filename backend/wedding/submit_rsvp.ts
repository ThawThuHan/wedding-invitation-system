import { api, APIError } from "encore.dev/api";
import { weddingDB } from "./db";
import type { RSVP } from "./types";

export interface SubmitRSVPRequest {
  guestId: number;
  attending: boolean;
  plusOneAttending?: boolean;
  dietaryRestrictions?: string;
  message?: string;
}

// Submits or updates an RSVP for a guest.
export const submitRSVP = api<SubmitRSVPRequest, RSVP>(
  { expose: true, method: "POST", path: "/rsvp" },
  async (req) => {
    // Check if guest exists
    const guest = await weddingDB.queryRow`
      SELECT id FROM guests WHERE id = ${req.guestId}
    `;

    if (!guest) {
      throw APIError.notFound("guest not found");
    }

    // Insert or update RSVP
    const row = await weddingDB.queryRow<{
      id: number;
      guest_id: number;
      attending: boolean;
      plus_one_attending: boolean;
      dietary_restrictions: string | null;
      message: string | null;
      responded_at: Date;
    }>`
      INSERT INTO rsvps (guest_id, attending, plus_one_attending, dietary_restrictions, message)
      VALUES (${req.guestId}, ${req.attending}, ${req.plusOneAttending || false}, ${req.dietaryRestrictions}, ${req.message})
      ON CONFLICT (guest_id) 
      DO UPDATE SET 
        attending = EXCLUDED.attending,
        plus_one_attending = EXCLUDED.plus_one_attending,
        dietary_restrictions = EXCLUDED.dietary_restrictions,
        message = EXCLUDED.message,
        responded_at = NOW()
      RETURNING *
    `;

    if (!row) {
      throw new Error("Failed to submit RSVP");
    }

    return {
      id: row.id,
      guestId: row.guest_id,
      attending: row.attending,
      plusOneAttending: row.plus_one_attending,
      dietaryRestrictions: row.dietary_restrictions || undefined,
      message: row.message || undefined,
      respondedAt: row.responded_at,
    };
  }
);
