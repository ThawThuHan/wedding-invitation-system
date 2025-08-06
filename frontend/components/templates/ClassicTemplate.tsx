import { Calendar, MapPin, Heart, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { WeddingWithPhotos } from "~backend/wedding/types";

interface ClassicTemplateProps {
  wedding: WeddingWithPhotos;
}

export default function ClassicTemplate({ wedding }: ClassicTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {wedding.heroPhotoUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${wedding.heroPhotoUrl})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        )}
        
        <div className="relative z-10 text-center text-white px-4">
          <div className="mb-8">
            <Heart className="w-16 h-16 mx-auto mb-6 text-rose-300" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-light mb-4">
            {wedding.brideName}
          </h1>
          <div className="text-4xl md:text-6xl font-serif font-light mb-4 text-rose-200">
            &
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-light mb-8">
            {wedding.groomName}
          </h1>
          
          <div className="text-xl md:text-2xl font-light tracking-wide">
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-800 mb-4">Join Us in Celebration</h2>
            <div className="w-24 h-px bg-rose-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-rose-600" />
                <h3 className="text-2xl font-serif text-gray-800 mb-4">When</h3>
                <p className="text-lg text-gray-600 mb-2">
                  {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-lg text-gray-600">
                  <Clock className="w-4 h-4 inline mr-2" />
                  {new Date(wedding.weddingDate).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-rose-600" />
                <h3 className="text-2xl font-serif text-gray-800 mb-4">Where</h3>
                <p className="text-lg text-gray-600 mb-2">{wedding.venue}</p>
                {wedding.placeDetails && (
                  <p className="text-gray-500">{wedding.placeDetails}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {wedding.description && (
            <Card className="border-none shadow-lg mb-16">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-serif text-gray-800 mb-4">Our Story</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  {wedding.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Photo Gallery */}
      {wedding.photos.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-gray-800 mb-4">Our Journey</h2>
              <div className="w-24 h-px bg-rose-400 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wedding.photos.map((photo, index) => (
                <div key={photo.id} className="group overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={photo.photoUrl}
                    alt={photo.caption || `Photo ${index + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {photo.caption && (
                    <div className="p-4 bg-white">
                      <p className="text-gray-600 text-center italic">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-rose-900 text-white text-center">
        <Heart className="w-8 h-8 mx-auto mb-4 text-rose-300" />
        <p className="text-lg font-serif">
          {wedding.brideName} & {wedding.groomName}
        </p>
        <p className="text-rose-200 mt-2">
          {new Date(wedding.weddingDate).getFullYear()}
        </p>
      </footer>
    </div>
  );
}
