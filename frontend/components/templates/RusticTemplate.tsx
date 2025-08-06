import { Calendar, MapPin, Heart, Clock, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { WeddingWithPhotos } from "~backend/wedding/types";

interface RusticTemplateProps {
  wedding: WeddingWithPhotos;
}

export default function RusticTemplate({ wedding }: RusticTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-orange-900/20">
        {wedding.heroPhotoUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${wedding.heroPhotoUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-transparent to-orange-900/60"></div>
          </div>
        )}
        
        <div className="relative z-10 text-center text-white px-4">
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Leaf className="w-8 h-8 text-green-300 transform -rotate-12" />
              <Heart className="w-12 h-12 text-red-300" />
              <Leaf className="w-8 h-8 text-green-300 transform rotate-12" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif mb-4 text-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
            {wedding.brideName}
          </h1>
          <div className="text-3xl md:text-4xl font-serif mb-4 text-amber-200">
            &
          </div>
          <h1 className="text-5xl md:text-7xl font-serif mb-12 text-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
            {wedding.groomName}
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <p className="text-xl md:text-2xl font-serif mb-2">are getting married!</p>
            <div className="text-lg md:text-xl font-serif text-amber-200">
              {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10">
            <Leaf className="w-32 h-32 text-green-600 transform rotate-45" />
          </div>
          <div className="absolute bottom-10 right-10">
            <Leaf className="w-24 h-24 text-orange-600 transform -rotate-12" />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-amber-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Join Our Celebration
            </h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-px bg-amber-600"></div>
              <div className="flex space-x-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <Heart className="w-4 h-4 text-red-600" />
                <Leaf className="w-4 h-4 text-orange-600" />
              </div>
              <div className="w-16 h-px bg-amber-600"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <Card className="border-2 border-amber-300 shadow-xl bg-white/90 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full flex items-end justify-start pl-2 pb-2">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <CardContent className="p-8 pt-12">
                <h3 className="text-2xl font-serif text-amber-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  When We Say "I Do"
                </h3>
                <p className="text-lg text-amber-800 mb-3 font-serif">
                  {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-lg text-amber-700 font-serif flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date(wedding.weddingDate).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-300 shadow-xl bg-white/90 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full flex items-end justify-start pl-2 pb-2">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
              <CardContent className="p-8 pt-12">
                <h3 className="text-2xl font-serif text-amber-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Where Love Blooms
                </h3>
                <p className="text-lg text-amber-800 mb-3 font-serif">{wedding.venue}</p>
                {wedding.placeDetails && (
                  <p className="text-amber-700 font-serif">{wedding.placeDetails}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {wedding.description && (
            <Card className="border-2 border-amber-300 shadow-xl bg-white/90 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-4 left-4">
                <Heart className="w-8 h-8 text-red-400" />
              </div>
              <div className="absolute bottom-4 right-4">
                <Leaf className="w-6 h-6 text-green-500 transform rotate-45" />
              </div>
              <CardContent className="p-10 text-center">
                <h3 className="text-3xl font-serif text-amber-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                  Our Love Story
                </h3>
                <p className="text-lg text-amber-800 leading-relaxed max-w-2xl mx-auto font-serif">
                  {wedding.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Photo Gallery */}
      {wedding.photos.length > 0 && (
        <section className="py-24 px-4 bg-gradient-to-br from-amber-100 to-orange-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif text-amber-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                Memory Lane
              </h2>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-px bg-amber-600"></div>
                <div className="flex space-x-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <Heart className="w-4 h-4 text-red-600" />
                  <Leaf className="w-4 h-4 text-orange-600" />
                </div>
                <div className="w-16 h-px bg-amber-600"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wedding.photos.map((photo, index) => (
                <div key={photo.id} className="group">
                  <div className="relative overflow-hidden rounded-lg shadow-xl border-4 border-white bg-white p-3 transform rotate-1 group-hover:rotate-0 transition-transform duration-300">
                    <img
                      src={photo.photoUrl}
                      alt={photo.caption || `Photo ${index + 1}`}
                      className="w-full h-64 object-cover rounded transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-1 right-1 w-6 h-6 bg-amber-200 rounded-full"></div>
                  </div>
                  {photo.caption && (
                    <div className="mt-4 text-center">
                      <p className="text-amber-800 font-serif italic">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 bg-gradient-to-r from-amber-800 to-orange-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Leaf className="absolute top-4 left-4 w-16 h-16 transform rotate-12" />
          <Leaf className="absolute bottom-4 right-4 w-12 h-12 transform -rotate-45" />
          <Heart className="absolute top-8 right-8 w-8 h-8" />
          <Heart className="absolute bottom-8 left-8 w-6 h-6" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Leaf className="w-6 h-6 text-green-300" />
            <Heart className="w-8 h-8 text-red-300" />
            <Leaf className="w-6 h-6 text-orange-300" />
          </div>
          <p className="text-2xl font-serif mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {wedding.brideName} & {wedding.groomName}
          </p>
          <p className="text-amber-200 font-serif">
            Forever & Always • {new Date(wedding.weddingDate).getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
