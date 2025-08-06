import { Calendar, MapPin, Heart, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { WeddingWithPhotos } from "~backend/wedding/types";

interface ElegantTemplateProps {
  wedding: WeddingWithPhotos;
}

export default function ElegantTemplate({ wedding }: ElegantTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {wedding.heroPhotoUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${wedding.heroPhotoUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
          </div>
        )}
        
        <div className="relative z-10 text-center text-white px-4">
          <div className="mb-12">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mb-8"></div>
            <Heart className="w-12 h-12 mx-auto text-amber-300" />
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mt-8"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif italic mb-4 text-shadow-lg">
            {wedding.brideName}
          </h1>
          <div className="text-3xl md:text-4xl font-serif italic mb-4 text-amber-200">
            and
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic mb-12 text-shadow-lg">
            {wedding.groomName}
          </h1>
          
          <div className="text-xl md:text-2xl font-serif tracking-wide">
            cordially invite you to celebrate their union
          </div>
          <div className="text-lg md:text-xl font-serif mt-4 text-amber-200">
            {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif italic text-gray-800 mb-6">
              Wedding Celebration
            </h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-px bg-amber-400"></div>
              <Heart className="w-6 h-6 text-amber-500" />
              <div className="w-16 h-px bg-amber-400"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <Card className="border-2 border-amber-200 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-10 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-serif italic text-gray-800 mb-6">When</h3>
                <p className="text-lg text-gray-700 mb-3 font-serif">
                  {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-lg text-gray-600 font-serif">
                  {new Date(wedding.weddingDate).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-10 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-serif italic text-gray-800 mb-6">Where</h3>
                <p className="text-lg text-gray-700 mb-3 font-serif">{wedding.venue}</p>
                {wedding.placeDetails && (
                  <p className="text-gray-600 font-serif">{wedding.placeDetails}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {wedding.description && (
            <Card className="border-2 border-amber-200 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-10 text-center">
                <h3 className="text-3xl font-serif italic text-gray-800 mb-8">Our Love Story</h3>
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="w-12 h-px bg-amber-400"></div>
                  <Heart className="w-5 h-5 text-amber-500" />
                  <div className="w-12 h-px bg-amber-400"></div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto font-serif italic">
                  {wedding.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Photo Gallery */}
      {wedding.photos.length > 0 && (
        <section className="py-24 px-4 bg-gradient-to-br from-white to-amber-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif italic text-gray-800 mb-6">
                Cherished Moments
              </h2>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-px bg-amber-400"></div>
                <Heart className="w-6 h-6 text-amber-500" />
                <div className="w-16 h-px bg-amber-400"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wedding.photos.map((photo, index) => (
                <div key={photo.id} className="group">
                  <div className="overflow-hidden rounded-lg shadow-xl border-4 border-amber-100 bg-white p-2">
                    <img
                      src={photo.photoUrl}
                      alt={photo.caption || `Photo ${index + 1}`}
                      className="w-full h-64 object-cover rounded transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {photo.caption && (
                    <div className="mt-4 text-center">
                      <p className="text-gray-600 font-serif italic">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 bg-gradient-to-r from-amber-800 to-orange-900 text-white text-center">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="w-16 h-px bg-amber-300"></div>
          <Heart className="w-8 h-8 text-amber-300" />
          <div className="w-16 h-px bg-amber-300"></div>
        </div>
        <p className="text-2xl font-serif italic mb-2">
          {wedding.brideName} & {wedding.groomName}
        </p>
        <p className="text-amber-200 font-serif">
          {new Date(wedding.weddingDate).getFullYear()}
        </p>
      </footer>
    </div>
  );
}
