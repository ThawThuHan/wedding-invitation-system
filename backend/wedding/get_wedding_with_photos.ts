import { api, APIError } from "encore.dev/api";
import { weddingDB } from "./db";
import type { WeddingWithPhotos, WeddingPhoto } from "./types";

export interface GetWeddingWithPhotosParams {
  id: number;
}

// Retrieves a specific wedding with its photos.
export const getWeddingWithPhotos = api<GetWeddingWithPhotosParams, WeddingWithPhotos>(
  { expose: true, method: "GET", path: "/weddings/:id/with-photos" },
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
      SELECT * FROM weddings WHERE id = ${params.id}
    `;

    if (!weddingRow) {
      throw APIError.notFound("wedding not found");
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
      WHERE wedding_id = ${params.id}
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
