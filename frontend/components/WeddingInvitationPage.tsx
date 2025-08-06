import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Heart, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import backend from "~backend/client";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import ElegantTemplate from "./templates/ElegantTemplate";
import RusticTemplate from "./templates/RusticTemplate";

export default function WeddingInvitationPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: wedding, isLoading, error } = useQuery({
    queryKey: ["wedding-page", slug],
    queryFn: () => backend.wedding.getWeddingBySlug({ slug: slug! }),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Not Found</h2>
            <p className="text-gray-600">
              This wedding invitation is not available or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the appropriate template based on the wedding's templateId
  const renderTemplate = () => {
    switch (wedding.templateId) {
      case 'modern':
        return <ModernTemplate wedding={wedding} />;
      case 'elegant':
        return <ElegantTemplate wedding={wedding} />;
      case 'rustic':
        return <RusticTemplate wedding={wedding} />;
      case 'classic':
      default:
        return <ClassicTemplate wedding={wedding} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderTemplate()}
    </div>
  );
}
