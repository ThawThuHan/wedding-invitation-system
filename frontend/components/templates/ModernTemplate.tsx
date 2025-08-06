import { Calendar, MapPin, Heart, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { WeddingWithPhotos } from "~backend/wedding/types";

interface ModernTemplateProps {
  wedding: WeddingWithPhotos;
}

export default function ModernTemplate({ wedding }: ModernTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800">
        {wedding.heroPhotoUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${wedding.heroPhotoUrl})` }}
          ></div>
        )}
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <div className="mb-12">
            <div className="w-px h-16 bg-white mx-auto mb-8"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light tracking-wider mb-6 uppercase">
            {wedding.brideName}
          </h1>
          <div className="text-2xl md:text-3xl font-light mb-6 tracking-widest">
            &
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-wider mb-12 uppercase">
            {wedding.groomName}
          </h1>
          
          <div className="text-lg md:text-xl font-light tracking-wide uppercase">
            {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          
          <div className="w-px h-16 bg-white mx-auto mt-8"></div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 uppercase tracking-wide">
                Celebration Details
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <Calendar className="w-8 h-8 text-gray-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2 uppercase tracking-wide">Date & Time</h3>
                    <p className="text-gray-600 text-lg">
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

                <div className="flex items-start space-x-6">
                  <MapPin className="w-8 h-8 text-gray-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2 uppercase tracking-wide">Venue</h3>
                    <p className="text-gray-600 text-lg">{wedding.venue}</p>
                    {wedding.placeDetails && (
                      <p className="text-gray-500 mt-1">{wedding.placeDetails}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {wedding.description && (
              <div className="bg-white p-8 shadow-sm">
                <h3 className="text-2xl font-light text-gray-900 mb-6 uppercase tracking-wide">Our Story</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {wedding.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {wedding.photos.length > 0 && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 uppercase tracking-wide">
                Gallery
              </h2>
              <div className="w-24 h-px bg-gray-400 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {wedding.photos.map((photo, index) => (
                <div key={photo.id} className="group overflow-hidden">
                  <img
                    src={photo.photoUrl}
                    alt={photo.caption || `Photo ${index + 1}`}
                    className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white text-center">
        <div className="w-px h-12 bg-white mx-auto mb-6"></div>
        <p className="text-lg font-light uppercase tracking-widest">
          {wedding.brideName} & {wedding.groomName}
        </p>
        <p className="text-gray-400 mt-2 tracking-wide">
          {new Date(wedding.weddingDate).getFullYear()}
        </p>
        <div className="w-px h-12 bg-white mx-auto mt-6"></div>
      </footer>
    </div>
  );
}
