import { api, APIError } from "encore.dev/api";
import { weddingDB } from "./db";
import type { Wedding, WeddingTemplate } from "./types";

export interface UpdateWeddingRequest {
  id: number;
  title?: string;
  brideName?: string;
  groomName?: string;
  weddingDate?: Date;
  venue?: string;
  description?: string;
  heroPhotoUrl?: string;
  placeDetails?: string;
  templateId?: WeddingTemplate;
}

// Updates a wedding invitation.
export const updateWedding = api<UpdateWeddingRequest, Wedding>(
  { expose: true, method: "PUT", path: "/weddings/:id" },
  async (req) => {
    // Check if wedding exists
    const existing = await weddingDB.queryRow`
      SELECT id FROM weddings WHERE id = ${req.id}
    `;

    if (!existing) {
      throw APIError.notFound("wedding not found");
    }

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
      SET 
        title = COALESCE(${req.title}, title),
        bride_name = COALESCE(${req.brideName}, bride_name),
        groom_name = COALESCE(${req.groomName}, groom_name),
        wedding_date = COALESCE(${req.weddingDate}, wedding_date),
        venue = COALESCE(${req.venue}, venue),
        description = COALESCE(${req.description}, description),
        hero_photo_url = COALESCE(${req.heroPhotoUrl}, hero_photo_url),
        place_details = COALESCE(${req.placeDetails}, place_details),
        template_id = COALESCE(${req.templateId}, template_id),
        updated_at = NOW()
      WHERE id = ${req.id}
      RETURNING *
    `;

    if (!row) {
      throw new Error("Failed to update wedding");
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
