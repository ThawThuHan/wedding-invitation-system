import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import WeddingList from "./components/WeddingList";
import WeddingDetail from "./components/WeddingDetail";
import CreateWedding from "./components/CreateWedding";
import GuestManagement from "./components/GuestManagement";
import RSVPForm from "./components/RSVPForm";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
          <Routes>
            <Route path="/" element={<WeddingList />} />
            <Route path="/create" element={<CreateWedding />} />
            <Route path="/wedding/:id" element={<WeddingDetail />} />
            <Route path="/wedding/:id/guests" element={<GuestManagement />} />
            <Route path="/rsvp/:guestId" element={<RSVPForm />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}
