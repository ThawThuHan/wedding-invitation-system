import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, BarChart3, Edit, Globe, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

export default function WeddingDetail() {
  const { id } = useParams<{ id: string }>();
  const weddingId = parseInt(id!);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wedding, isLoading: weddingLoading } = useQuery({
    queryKey: ["wedding", weddingId],
    queryFn: () => backend.wedding.getWedding({ id: weddingId }),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["rsvp-stats", weddingId],
    queryFn: () => backend.wedding.getRSVPStats({ weddingId }),
  });

  const publishMutation = useMutation({
    mutationFn: () => backend.wedding.publishWedding({ id: weddingId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wedding", weddingId] });
      toast({
        title: "Wedding published!",
        description: "Your wedding invitation is now live and ready to share.",
      });
      
      // Copy URL to clipboard
      navigator.clipboard.writeText(data.webpageUrl).then(() => {
        toast({
          title: "URL copied!",
          description: "The wedding invitation URL has been copied to your clipboard.",
        });
      });
    },
    onError: (error) => {
      console.error("Error publishing wedding:", error);
      toast({
        title: "Error",
        description: "Failed to publish wedding. Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyInvitationUrl = () => {
    if (wedding?.webpageSlug) {
      const url = `${window.location.origin}/invitation/${wedding.webpageSlug}`;
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "URL copied!",
          description: "The wedding invitation URL has been copied to your clipboard.",
        });
      });
    }
  };

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
  const invitationUrl = wedding.webpageSlug ? `${window.location.origin}/invitation/${wedding.webpageSlug}` : null;

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
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={wedding.isPublished ? "default" : "secondary"}>
                {wedding.isPublished ? "Published" : "Draft"}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {wedding.templateId} Template
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/wedding/${weddingId}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
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
                  {wedding.placeDetails && (
                    <p className="text-gray-500 text-sm mt-1">{wedding.placeDetails}</p>
                  )}
                </div>
              </div>
              {wedding.description && (
                <div>
                  <p className="font-medium mb-2">Description</p>
                  <p className="text-gray-600">{wedding.description}</p>
                </div>
              )}
              {wedding.heroPhotoUrl && (
                <div>
                  <p className="font-medium mb-2">Hero Photo</p>
                  <img
                    src={wedding.heroPhotoUrl}
                    alt="Wedding hero"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Wedding Invitation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {wedding.isPublished ? (
                <>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Your wedding invitation is live!
                    </p>
                  </div>
                  <div className="space-y-2">
                    {invitationUrl && (
                      <Link to={`/invitation/${wedding.webpageSlug}`} target="_blank">
                        <Button variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Invitation
                        </Button>
                      </Link>
                    )}
                    <Button onClick={copyInvitationUrl} className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Copy Invitation URL
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Publish your wedding invitation to share with guests
                    </p>
                  </div>
                  <Button
                    onClick={() => publishMutation.mutate()}
                    disabled={publishMutation.isPending}
                    className="w-full bg-rose-600 hover:bg-rose-700"
                  >
                    {publishMutation.isPending ? "Publishing..." : "Publish Invitation"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

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
