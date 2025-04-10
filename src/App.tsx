
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataStoreProvider } from "./lib/data-store";
import Index from "./pages/Index";
import Performance from "./pages/Performance";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import DataOverview from "./pages/DataOverview";
import VideoUpload from "./pages/VideoUpload";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataStoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/data-overview" element={<DataOverview />} />
            <Route path="/video-upload" element={<VideoUpload />} />
            <Route path="/matches" element={<Navigate to="/data-overview" replace />} />
            <Route path="/match-overview" element={<Navigate to="/data-overview" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataStoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
