export interface Wedding {
  id: number;
  title: string;
  brideName: string;
  groomName: string;
  weddingDate: Date;
  venue: string;
  description?: string;
  heroPhotoUrl?: string;
  placeDetails?: string;
  templateId: string;
  isPublished: boolean;
  webpageSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeddingPhoto {
  id: number;
  weddingId: number;
  photoUrl: string;
  caption?: string;
  displayOrder: number;
  createdAt: Date;
}

export interface WeddingWithPhotos extends Wedding {
  photos: WeddingPhoto[];
}

export interface Guest {
  id: number;
  weddingId: number;
  name: string;
  email: string;
  phone?: string;
  plusOneAllowed: boolean;
  invitedAt: Date;
  createdAt: Date;
}

export interface RSVP {
  id: number;
  guestId: number;
  attending: boolean;
  plusOneAttending: boolean;
  dietaryRestrictions?: string;
  message?: string;
  respondedAt: Date;
}

export interface GuestWithRSVP extends Guest {
  rsvp?: RSVP;
}

export type WeddingTemplate = 'classic' | 'modern' | 'elegant' | 'rustic';
