import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Mail, Phone, UserPlus, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { GuestWithRSVP } from "~backend/wedding/types";

export default function GuestManagement() {
  const { id } = useParams<{ id: string }>();
  const weddingId = parseInt(id!);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plusOneAllowed: false,
  });

  const { data: wedding } = useQuery({
    queryKey: ["wedding", weddingId],
    queryFn: () => backend.wedding.getWedding({ id: weddingId }),
  });

  const { data: guestsData, isLoading } = useQuery({
    queryKey: ["guests", weddingId],
    queryFn: () => backend.wedding.listGuests({ weddingId }),
  });

  const addGuestMutation = useMutation({
    mutationFn: (data: typeof formData) => backend.wedding.addGuest({
      weddingId,
      ...data,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests", weddingId] });
      queryClient.invalidateQueries({ queryKey: ["rsvp-stats", weddingId] });
      setFormData({ name: "", email: "", phone: "", plusOneAllowed: false });
      setShowAddForm(false);
      toast({
        title: "Guest added successfully!",
        description: "The guest has been added to your wedding.",
      });
    },
    onError: (error) => {
      console.error("Error adding guest:", error);
      toast({
        title: "Error",
        description: "Failed to add guest. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in name and email.",
        variant: "destructive",
      });
      return;
    }
    addGuestMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getRSVPStatus = (guest: GuestWithRSVP) => {
    if (!guest.rsvp) {
      return { status: "pending", icon: Clock, color: "bg-yellow-100 text-yellow-800" };
    }
    if (guest.rsvp.attending) {
      return { status: "attending", icon: Check, color: "bg-green-100 text-green-800" };
    }
    return { status: "not attending", icon: X, color: "bg-red-100 text-red-800" };
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

  const guests = guestsData?.guests || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link to={`/wedding/${weddingId}`} className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wedding Details
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Management</h1>
            {wedding && (
              <p className="text-gray-600">{wedding.title} - {guests.length} guests</p>
            )}
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-rose-600 hover:bg-rose-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Guest
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Guest</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Guest name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="guest@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="plusOneAllowed"
                    checked={formData.plusOneAllowed}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, plusOneAllowed: checked as boolean }))
                    }
                  />
                  <Label htmlFor="plusOneAllowed">Allow plus one</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={addGuestMutation.isPending}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  {addGuestMutation.isPending ? "Adding..." : "Add Guest"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {guests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-12 h-12 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No guests yet</h3>
            <p className="text-gray-600 mb-6">Start building your guest list by adding your first guest</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-rose-600 hover:bg-rose-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Guest
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guests.map((guest: GuestWithRSVP) => {
            const rsvpStatus = getRSVPStatus(guest);
            const StatusIcon = rsvpStatus.icon;

            return (
              <Card key={guest.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{guest.name}</h3>
                    <Badge className={rsvpStatus.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {rsvpStatus.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{guest.email}</span>
                    </div>
                    {guest.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{guest.phone}</span>
                      </div>
                    )}
                    {guest.plusOneAllowed && (
                      <div className="flex items-center">
                        <UserPlus className="w-4 h-4 mr-2" />
                        <span>Plus one allowed</span>
                        {guest.rsvp?.plusOneAttending && (
                          <Badge variant="outline" className="ml-2">
                            +1 attending
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {guest.rsvp && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">
                        Responded {new Date(guest.rsvp.respondedAt).toLocaleDateString()}
                      </p>
                      {guest.rsvp.message && (
                        <p className="text-sm text-gray-600 mt-1 italic">
                          "{guest.rsvp.message}"
                        </p>
                      )}
                      {guest.rsvp.dietaryRestrictions && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Dietary:</strong> {guest.rsvp.dietaryRestrictions}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t">
                    <Link to={`/rsvp/${guest.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View RSVP Link
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
