import { api } from "encore.dev/api";
import { weddingDB } from "./db";
import type { Wedding } from "./types";

export interface CreateWeddingRequest {
  title: string;
  brideName: string;
  groomName: string;
  weddingDate: Date;
  venue: string;
  description?: string;
}

// Creates a new wedding invitation.
export const createWedding = api<CreateWeddingRequest, Wedding>(
  { expose: true, method: "POST", path: "/weddings" },
  async (req) => {
    const row = await weddingDB.queryRow<{
      id: number;
      title: string;
      bride_name: string;
      groom_name: string;
      wedding_date: Date;
      venue: string;
      description: string | null;
      created_at: Date;
      updated_at: Date;
    }>`
      INSERT INTO weddings (title, bride_name, groom_name, wedding_date, venue, description)
      VALUES (${req.title}, ${req.brideName}, ${req.groomName}, ${req.weddingDate}, ${req.venue}, ${req.description})
      RETURNING *
    `;

    if (!row) {
      throw new Error("Failed to create wedding");
    }

    return {
      id: row.id,
      title: row.title,
      brideName: row.bride_name,
      groomName: row.groom_name,
      weddingDate: row.wedding_date,
      venue: row.venue,
      description: row.description || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);
