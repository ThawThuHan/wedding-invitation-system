import { api, APIError } from "encore.dev/api";
import { weddingDB } from "./db";
import type { WeddingWithPhotos, WeddingPhoto } from "./types";

export interface GetWeddingBySlugParams {
  slug: string;
}

// Retrieves a published wedding by its webpage slug.
export const getWeddingBySlug = api<GetWeddingBySlugParams, WeddingWithPhotos>(
  { expose: true, method: "GET", path: "/wedding-page/:slug" },
  async (params) => {
    const weddingRow = await weddingDB.queryRow<{
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
      SELECT * FROM weddings WHERE webpage_slug = ${params.slug} AND is_published = true
    `;

    if (!weddingRow) {
      throw APIError.notFound("wedding page not found or not published");
    }

    const photoRows = await weddingDB.queryAll<{
      id: number;
      wedding_id: number;
      photo_url: string;
      caption: string | null;
      display_order: number;
      created_at: Date;
    }>`
      SELECT * FROM wedding_photos 
      WHERE wedding_id = ${weddingRow.id}
      ORDER BY display_order ASC, created_at ASC
    `;

    const photos: WeddingPhoto[] = photoRows.map(row => ({
      id: row.id,
      weddingId: row.wedding_id,
      photoUrl: row.photo_url,
      caption: row.caption || undefined,
      displayOrder: row.display_order,
      createdAt: row.created_at,
    }));

    return {
      id: weddingRow.id,
      title: weddingRow.title,
      brideName: weddingRow.bride_name,
      groomName: weddingRow.groom_name,
      weddingDate: weddingRow.wedding_date,
      venue: weddingRow.venue,
      description: weddingRow.description || undefined,
      heroPhotoUrl: weddingRow.hero_photo_url || undefined,
      placeDetails: weddingRow.place_details || undefined,
      templateId: weddingRow.template_id,
      isPublished: weddingRow.is_published,
      webpageSlug: weddingRow.webpage_slug || undefined,
      createdAt: weddingRow.created_at,
      updatedAt: weddingRow.updated_at,
      photos,
    };
  }
);
