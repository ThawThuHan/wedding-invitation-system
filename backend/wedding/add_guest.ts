import { api } from "encore.dev/api";
import { weddingDB } from "./db";
import type { Guest } from "./types";

export interface AddGuestRequest {
  weddingId: number;
  name: string;
  email: string;
  phone?: string;
  plusOneAllowed?: boolean;
}

// Adds a new guest to a wedding invitation.
export const addGuest = api<AddGuestRequest, Guest>(
  { expose: true, method: "POST", path: "/guests" },
  async (req) => {
    const row = await weddingDB.queryRow<{
      id: number;
      wedding_id: number;
      name: string;
      email: string;
      phone: string | null;
      plus_one_allowed: boolean;
      invited_at: Date;
      created_at: Date;
    }>`
      INSERT INTO guests (wedding_id, name, email, phone, plus_one_allowed)
      VALUES (${req.weddingId}, ${req.name}, ${req.email}, ${req.phone}, ${req.plusOneAllowed || false})
      RETURNING *
    `;

    if (!row) {
      throw new Error("Failed to add guest");
    }

    return {
      id: row.id,
      weddingId: row.wedding_id,
      name: row.name,
      email: row.email,
      phone: row.phone || undefined,
      plusOneAllowed: row.plus_one_allowed,
      invitedAt: row.invited_at,
      createdAt: row.created_at,
    };
  }
);
