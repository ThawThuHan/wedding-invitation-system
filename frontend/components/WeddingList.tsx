import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Calendar, MapPin, Users, Globe, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import backend from "~backend/client";
import type { Wedding } from "~backend/wedding/types";

export default function WeddingList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weddings"],
    queryFn: () => backend.wedding.listWeddings(),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading weddings. Please try again.
        </div>
      </div>
    );
  }

  const weddings = data?.weddings || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wedding Invitations</h1>
          <p className="text-gray-600">Create beautiful wedding invitations and manage your guest lists</p>
        </div>
        <Link to="/create">
          <Button className="bg-rose-600 hover:bg-rose-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Wedding
          </Button>
        </Link>
      </div>

      {weddings.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-rose-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No weddings yet</h3>
          <p className="text-gray-600 mb-6">Create your first wedding invitation to get started</p>
          <Link to="/create">
            <Button className="bg-rose-600 hover:bg-rose-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Wedding
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddings.map((wedding: Wedding) => (
            <Card key={wedding.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900">{wedding.title}</CardTitle>
                    <div className="text-lg font-medium text-rose-600">
                      {wedding.brideName} & {wedding.groomName}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={wedding.isPublished ? "default" : "secondary"}>
                      {wedding.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {wedding.templateId}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(wedding.weddingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{wedding.venue}</span>
                </div>
                {wedding.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">{wedding.description}</p>
                )}
                
                <div className="flex flex-col gap-2 pt-4">
                  <div className="flex gap-2">
                    <Link to={`/wedding/${wedding.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/wedding/${wedding.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/wedding/${wedding.id}/guests`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Users className="w-4 h-4 mr-1" />
                        Guests
                      </Button>
                    </Link>
                    {wedding.isPublished && wedding.webpageSlug && (
                      <Link to={`/invitation/${wedding.webpageSlug}`} target="_blank">
                        <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                          <Globe className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
