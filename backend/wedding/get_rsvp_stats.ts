import { api } from "encore.dev/api";
import { weddingDB } from "./db";

export interface GetRSVPStatsParams {
  weddingId: number;
}

export interface RSVPStats {
  totalGuests: number;
  totalResponded: number;
  totalAttending: number;
  totalNotAttending: number;
  totalPlusOnes: number;
  responseRate: number;
}

export interface GetRSVPStatsResponse {
  stats: RSVPStats;
}

// Retrieves RSVP statistics for a wedding.
export const getRSVPStats = api<GetRSVPStatsParams, GetRSVPStatsResponse>(
  { expose: true, method: "GET", path: "/weddings/:weddingId/rsvp-stats" },
  async (params) => {
    const stats = await weddingDB.queryRow<{
      total_guests: number;
      total_responded: number;
      total_attending: number;
      total_not_attending: number;
      total_plus_ones: number;
    }>`
      SELECT 
        COUNT(g.id) as total_guests,
        COUNT(r.id) as total_responded,
        COUNT(CASE WHEN r.attending = true THEN 1 END) as total_attending,
        COUNT(CASE WHEN r.attending = false THEN 1 END) as total_not_attending,
        COUNT(CASE WHEN r.plus_one_attending = true THEN 1 END) as total_plus_ones
      FROM guests g
      LEFT JOIN rsvps r ON g.id = r.guest_id
      WHERE g.wedding_id = ${params.weddingId}
    `;

    if (!stats) {
      throw new Error("Failed to get RSVP stats");
    }

    const responseRate = stats.total_guests > 0 
      ? (stats.total_responded / stats.total_guests) * 100 
      : 0;

    return {
      stats: {
        totalGuests: stats.total_guests,
        totalResponded: stats.total_responded,
        totalAttending: stats.total_attending,
        totalNotAttending: stats.total_not_attending,
        totalPlusOnes: stats.total_plus_ones,
        responseRate: Math.round(responseRate * 100) / 100,
      },
    };
  }
);
