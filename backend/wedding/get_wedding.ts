import { api, APIError } from "encore.dev/api";
import { weddingDB } from "./db";
import type { Wedding } from "./types";

export interface GetWeddingParams {
  id: number;
}

// Retrieves a specific wedding by ID.
export const getWedding = api<GetWeddingParams, Wedding>(
  { expose: true, method: "GET", path: "/weddings/:id" },
  async (params) => {
    const row = await weddingDB.queryRow<{
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
      SELECT * FROM weddings WHERE id = ${params.id}
    `;

    if (!row) {
      throw APIError.notFound("wedding not found");
    }

    return {
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
    };
  }
);
