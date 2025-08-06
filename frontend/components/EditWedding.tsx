import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Upload, X, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { WeddingTemplate } from "~backend/wedding/types";

const templates: { id: WeddingTemplate; name: string; description: string }[] = [
  { id: 'classic', name: 'Classic', description: 'Timeless and elegant design' },
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary style' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated and luxurious' },
  { id: 'rustic', name: 'Rustic', description: 'Natural and charming aesthetic' },
];

export default function EditWedding() {
  const { id } = useParams<{ id: string }>();
  const weddingId = parseInt(id!);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    brideName: "",
    groomName: "",
    weddingDate: "",
    venue: "",
    description: "",
    heroPhotoUrl: "",
    placeDetails: "",
    templateId: "classic" as WeddingTemplate,
  });

  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  const { data: weddingData, isLoading } = useQuery({
    queryKey: ["wedding-with-photos", weddingId],
    queryFn: () => backend.wedding.getWeddingWithPhotos({ id: weddingId }),
  });

  useEffect(() => {
    if (weddingData) {
      const wedding = weddingData;
      setFormData({
        title: wedding.title,
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        weddingDate: new Date(wedding.weddingDate).toISOString().slice(0, 16),
        venue: wedding.venue,
        description: wedding.description || "",
        heroPhotoUrl: wedding.heroPhotoUrl || "",
        placeDetails: wedding.placeDetails || "",
        templateId: wedding.templateId as WeddingTemplate,
      });
      setGalleryPhotos(wedding.photos.map(p => p.photoUrl));
    }
  }, [weddingData]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const wedding = await backend.wedding.updateWedding({
        id: weddingId,
        ...data,
        weddingDate: new Date(data.weddingDate),
      });

      // For simplicity, we'll just add new photos (in a real app, you'd want to handle updates/deletions)
      const currentPhotos = weddingData?.photos.map(p => p.photoUrl) || [];
      const newPhotos = galleryPhotos.filter(url => !currentPhotos.includes(url));
      
      for (let i = 0; i < newPhotos.length; i++) {
        await backend.wedding.addWeddingPhoto({
          weddingId: wedding.id,
          photoUrl: newPhotos[i],
          displayOrder: currentPhotos.length + i,
        });
      }

      return wedding;
    },
    onSuccess: (wedding) => {
      queryClient.invalidateQueries({ queryKey: ["wedding", weddingId] });
      queryClient.invalidateQueries({ queryKey: ["wedding-with-photos", weddingId] });
      toast({
        title: "Wedding updated successfully!",
        description: "Your wedding details have been saved.",
      });
      navigate(`/wedding/${wedding.id}`);
    },
    onError: (error) => {
      console.error("Error updating wedding:", error);
      toast({
        title: "Error",
        description: "Failed to update wedding. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.brideName || !formData.groomName || !formData.weddingDate || !formData.venue) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addGalleryPhoto = () => {
    if (newPhotoUrl.trim() && !galleryPhotos.includes(newPhotoUrl.trim())) {
      setGalleryPhotos(prev => [...prev, newPhotoUrl.trim()]);
      setNewPhotoUrl("");
    }
  };

  const removeGalleryPhoto = (index: number) => {
    setGalleryPhotos(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
        </div>
      </div>
    );
  }

  if (!weddingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Wedding not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to={`/wedding/${weddingId}`} className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wedding Details
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Wedding</h1>
        <p className="text-gray-600">Update your wedding details and customize your invitation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-rose-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Wedding Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Sarah & John's Wedding"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brideName">Bride's Name *</Label>
                <Input
                  id="brideName"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleChange}
                  placeholder="Bride's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="groomName">Groom's Name *</Label>
                <Input
                  id="groomName"
                  name="groomName"
                  value={formData.groomName}
                  onChange={handleChange}
                  placeholder="Groom's name"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="weddingDate">Wedding Date & Time *</Label>
              <Input
                id="weddingDate"
                name="weddingDate"
                type="datetime-local"
                value={formData.weddingDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="venue">Venue *</Label>
              <Input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Wedding venue name"
                required
              />
            </div>

            <div>
              <Label htmlFor="placeDetails">Place Details</Label>
              <Textarea
                id="placeDetails"
                name="placeDetails"
                value={formData.placeDetails}
                onChange={handleChange}
                placeholder="Full address, directions, parking information..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional details about your wedding..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-rose-600" />
              Template Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Choose Template</Label>
              <Select
                value={formData.templateId}
                onValueChange={(value: WeddingTemplate) => 
                  setFormData(prev => ({ ...prev, templateId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="heroPhotoUrl">Hero Photo URL</Label>
              <Input
                id="heroPhotoUrl"
                name="heroPhotoUrl"
                value={formData.heroPhotoUrl}
                onChange={handleChange}
                placeholder="https://example.com/hero-photo.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be the main photo displayed on your wedding invitation page
              </p>
            </div>
            {formData.heroPhotoUrl && (
              <div className="mt-4">
                <img
                  src={formData.heroPhotoUrl}
                  alt="Hero preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photo Gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1"
              />
              <Button type="button" onClick={addGalleryPhoto} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </div>

            {galleryPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryPhotos.map((photoUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photoUrl}
                      alt={`Gallery photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeGalleryPhoto(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-rose-600 hover:bg-rose-700 flex-1"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Link to={`/wedding/${weddingId}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
