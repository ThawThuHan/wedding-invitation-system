export interface Wedding {
  id: number;
  title: string;
  brideName: string;
  groomName: string;
  weddingDate: Date;
  venue: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
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
