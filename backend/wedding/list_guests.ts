import { api } from "encore.dev/api";
import { weddingDB } from "./db";
import type { GuestWithRSVP } from "./types";

export interface ListGuestsParams {
  weddingId: number;
}

export interface ListGuestsResponse {
  guests: GuestWithRSVP[];
}

// Retrieves all guests for a specific wedding with their RSVP status.
export const listGuests = api<ListGuestsParams, ListGuestsResponse>(
  { expose: true, method: "GET", path: "/weddings/:weddingId/guests" },
  async (params) => {
    const rows = await weddingDB.queryAll<{
      id: number;
      wedding_id: number;
      name: string;
      email: string;
      phone: string | null;
      plus_one_allowed: boolean;
      invited_at: Date;
      created_at: Date;
      rsvp_id: number | null;
      attending: boolean | null;
      plus_one_attending: boolean | null;
      dietary_restrictions: string | null;
      message: string | null;
      responded_at: Date | null;
    }>`
      SELECT 
        g.*,
        r.id as rsvp_id,
        r.attending,
        r.plus_one_attending,
        r.dietary_restrictions,
        r.message,
        r.responded_at
      FROM guests g
      LEFT JOIN rsvps r ON g.id = r.guest_id
      WHERE g.wedding_id = ${params.weddingId}
      ORDER BY g.name ASC
    `;

    const guests: GuestWithRSVP[] = rows.map(row => ({
      id: row.id,
      weddingId: row.wedding_id,
      name: row.name,
      email: row.email,
      phone: row.phone || undefined,
      plusOneAllowed: row.plus_one_allowed,
      invitedAt: row.invited_at,
      createdAt: row.created_at,
      rsvp: row.rsvp_id ? {
        id: row.rsvp_id,
        guestId: row.id,
        attending: row.attending!,
        plusOneAttending: row.plus_one_attending!,
        dietaryRestrictions: row.dietary_restrictions || undefined,
        message: row.message || undefined,
        respondedAt: row.responded_at!,
      } : undefined,
    }));

    return { guests };
  }
);
