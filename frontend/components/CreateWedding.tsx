import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

export default function CreateWedding() {
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
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => backend.wedding.createWedding({
      ...data,
      weddingDate: new Date(data.weddingDate),
    }),
    onSuccess: (wedding) => {
      queryClient.invalidateQueries({ queryKey: ["weddings"] });
      toast({
        title: "Wedding created successfully!",
        description: "Your wedding invitation has been created.",
      });
      navigate(`/wedding/${wedding.id}`);
    },
    onError: (error) => {
      console.error("Error creating wedding:", error);
      toast({
        title: "Error",
        description: "Failed to create wedding. Please try again.",
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
    createMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Weddings
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Wedding Invitation</h1>
        <p className="text-gray-600">Set up your wedding details and start managing your guest list</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-rose-600" />
            Wedding Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="weddingDate">Wedding Date *</Label>
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
                placeholder="Wedding venue address"
                required
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

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-rose-600 hover:bg-rose-700 flex-1"
              >
                {createMutation.isPending ? "Creating..." : "Create Wedding"}
              </Button>
              <Link to="/">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
