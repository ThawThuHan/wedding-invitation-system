import { api } from "encore.dev/api";
import { weddingDB } from "./db";
import type { Wedding } from "./types";

export interface ListWeddingsResponse {
  weddings: Wedding[];
}

// Retrieves all weddings, ordered by wedding date.
export const listWeddings = api<void, ListWeddingsResponse>(
  { expose: true, method: "GET", path: "/weddings" },
  async () => {
    const rows = await weddingDB.queryAll<{
      id: number;
      title: string;
      bride_name: string;
      groom_name: string;
      wedding_date: Date;
      venue: string;
      description: string | null;
      hero_photo_url: string | null;
      place_details: string | null;
      template_id: string;
      is_published: boolean;
      webpage_slug: string | null;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT * FROM weddings 
      ORDER BY wedding_date ASC
    `;

    const weddings: Wedding[] = rows.map(row => ({
      id: row.id,
      title: row.title,
      brideName: row.bride_name,
      groomName: row.groom_name,
      weddingDate: row.wedding_date,
      venue: row.venue,
      description: row.description || undefined,
      heroPhotoUrl: row.hero_photo_url || undefined,
      placeDetails: row.place_details || undefined,
      templateId: row.template_id,
      isPublished: row.is_published,
      webpageSlug: row.webpage_slug || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { weddings };
  }
);
