import { api } from "encore.dev/api";
import { weddingDB } from "./db";
import type { WeddingPhoto } from "./types";

export interface AddWeddingPhotoRequest {
  weddingId: number;
  photoUrl: string;
  caption?: string;
  displayOrder?: number;
}

// Adds a photo to a wedding gallery.
export const addWeddingPhoto = api<AddWeddingPhotoRequest, WeddingPhoto>(
  { expose: true, method: "POST", path: "/wedding-photos" },
  async (req) => {
    const row = await weddingDB.queryRow<{
      id: number;
      wedding_id: number;
      photo_url: string;
      caption: string | null;
      display_order: number;
      created_at: Date;
    }>`
      INSERT INTO wedding_photos (wedding_id, photo_url, caption, display_order)
      VALUES (${req.weddingId}, ${req.photoUrl}, ${req.caption}, ${req.displayOrder || 0})
      RETURNING *
    `;

    if (!row) {
      throw new Error("Failed to add wedding photo");
    }

    return {
      id: row.id,
      weddingId: row.wedding_id,
      photoUrl: row.photo_url,
      caption: row.caption || undefined,
      displayOrder: row.display_order,
      createdAt: row.created_at,
    };
  }
);
