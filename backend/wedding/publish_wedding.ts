import { api, APIError } from "encore.dev/api";
import { weddingDB } from "./db";
import type { Wedding } from "./types";

export interface PublishWeddingRequest {
  id: number;
}

export interface PublishWeddingResponse {
  wedding: Wedding;
  webpageUrl: string;
}

// Publishes a wedding webpage.
export const publishWedding = api<PublishWeddingRequest, PublishWeddingResponse>(
  { expose: true, method: "POST", path: "/weddings/:id/publish" },
  async (req) => {
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
      UPDATE weddings 
      SET is_published = true, updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING *
    `;

    if (!row) {
      throw APIError.notFound("wedding not found");
    }

    const wedding: Wedding = {
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

    const webpageUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invitation/${row.webpage_slug}`;

    return {
      wedding,
      webpageUrl,
    };
  }
);
