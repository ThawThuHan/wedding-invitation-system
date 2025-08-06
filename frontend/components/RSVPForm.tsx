import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Heart, Calendar, MapPin, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";

export default function RSVPForm() {
  const { guestId } = useParams<{ guestId: string }>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    attending: "",
    plusOneAttending: false,
    dietaryRestrictions: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // We need to get guest info and wedding info
  // Since we only have guestId, we'll need to fetch guest first, then wedding
  const { data: guestsData } = useQuery({
    queryKey: ["guest-rsvp", guestId],
    queryFn: async () => {
      // We need to find the guest by iterating through weddings
      // This is not ideal but works for the demo
      const weddings = await backend.wedding.listWeddings();
      for (const wedding of weddings.weddings) {
        const guests = await backend.wedding.listGuests({ weddingId: wedding.id });
        const guest = guests.guests.find(g => g.id === parseInt(guestId!));
        if (guest) {
          return { guest, wedding };
        }
      }
      return null;
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data: typeof formData) => backend.wedding.submitRSVP({
      guestId: parseInt(guestId!),
      attending: data.attending === "yes",
      plusOneAttending: data.plusOneAttending,
      dietaryRestrictions: data.dietaryRestrictions || undefined,
      message: data.message || undefined,
    }),
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "RSVP submitted successfully!",
        description: "Thank you for your response.",
      });
    },
    onError: (error) => {
      console.error("Error submitting RSVP:", error);
      toast({
        title: "Error",
        description: "Failed to submit RSVP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.attending) {
      toast({
        title: "Please select attendance",
        description: "Please let us know if you'll be attending.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(formData);
  };

  if (!guestsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
        </div>
      </div>
    );
  }

  const { guest, wedding } = guestsData;

  if (!guest || !wedding) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">RSVP Not Found</h2>
            <p className="text-gray-600">This RSVP link is not valid or has expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted || guest.rsvp) {
    const rsvp = guest.rsvp;
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">RSVP Submitted</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Thank you for responding to {wedding.title}!
            </p>
            {rsvp && (
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-2">Your Response:</h3>
                <p><strong>Attending:</strong> {rsvp.attending ? "Yes" : "No"}</p>
                {guest.plusOneAllowed && (
                  <p><strong>Plus One:</strong> {rsvp.plusOneAttending ? "Yes" : "No"}</p>
                )}
                {rsvp.dietaryRestrictions && (
                  <p><strong>Dietary Restrictions:</strong> {rsvp.dietaryRestrictions}</p>
                )}
                {rsvp.message && (
                  <p><strong>Message:</strong> {rsvp.message}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-rose-600" />
          </div>
          <CardTitle className="text-2xl">{wedding.title}</CardTitle>
          <p className="text-xl text-rose-600 font-medium">
            {wedding.brideName} & {wedding.groomName}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>
                {new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{wedding.venue}</span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Hello {guest.name}!</h3>
            <p className="text-gray-600 mb-6">
              We're excited to celebrate with you. Please let us know if you'll be joining us!
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-base font-medium">Will you be attending? *</Label>
                <RadioGroup
                  value={formData.attending}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, attending: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Yes, I'll be there!
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="flex items-center">
                      <X className="w-4 h-4 mr-2 text-red-600" />
                      Sorry, I can't make it
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {guest.plusOneAllowed && formData.attending === "yes" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="plusOne"
                    checked={formData.plusOneAttending}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, plusOneAttending: checked as boolean }))
                    }
                  />
                  <Label htmlFor="plusOne">My plus one will also be attending</Label>
                </div>
              )}

              {formData.attending === "yes" && (
                <div>
                  <Label htmlFor="dietary">Dietary Restrictions or Allergies</Label>
                  <Input
                    id="dietary"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
                    placeholder="Please let us know about any dietary needs"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="message">Message for the Couple</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Share your excitement or well wishes..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-rose-600 hover:bg-rose-700"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit RSVP"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
