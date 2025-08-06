import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, BarChart3, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import backend from "~backend/client";

export default function WeddingDetail() {
  const { id } = useParams<{ id: string }>();
  const weddingId = parseInt(id!);

  const { data: wedding, isLoading: weddingLoading } = useQuery({
    queryKey: ["wedding", weddingId],
    queryFn: () => backend.wedding.getWedding({ id: weddingId }),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["rsvp-stats", weddingId],
    queryFn: () => backend.wedding.getRSVPStats({ weddingId }),
  });

  if (weddingLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
        </div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Wedding not found.
        </div>
      </div>
    );
  }

  const stats = statsData?.stats;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Weddings
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{wedding.title}</h1>
            <p className="text-xl text-rose-600 font-medium">
              {wedding.brideName} & {wedding.groomName}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/wedding/${weddingId}/guests`}>
              <Button className="bg-rose-600 hover:bg-rose-700">
                <Users className="w-4 h-4 mr-2" />
                Manage Guests
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wedding Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-rose-600" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-gray-600">
                    {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-gray-600">
                    {new Date(wedding.weddingDate).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-rose-600" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p className="text-gray-600">{wedding.venue}</p>
                </div>
              </div>
              {wedding.description && (
                <div>
                  <p className="font-medium mb-2">Description</p>
                  <p className="text-gray-600">{wedding.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                RSVP Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
                </div>
              ) : stats ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Guests</span>
                    <Badge variant="outline">{stats.totalGuests}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Responded</span>
                    <Badge variant="outline">{stats.totalResponded}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Attending</span>
                    <Badge className="bg-green-100 text-green-800">{stats.totalAttending}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Not Attending</span>
                    <Badge className="bg-red-100 text-red-800">{stats.totalNotAttending}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plus Ones</span>
                    <Badge variant="outline">{stats.totalPlusOnes}</Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Response Rate</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {stats.responseRate}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No statistics available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={`/wedding/${weddingId}/guests`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  View All Guests
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
