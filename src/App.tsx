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
import Shotmap from "./pages/ShotMap";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { RequireAuth } from "./components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataStoreProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<RequireAuth />}>
                <Route path="/" element={<Index />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/shotmap/:id?" element={<Shotmap />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/data-overview" element={<DataOverview />} />
                <Route path="/video-upload" element={<VideoUpload />} />
                <Route path="/matches" element={<Navigate to="/data-overview" replace />} />
                <Route path="/match-overview" element={<Navigate to="/data-overview" replace />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </DataStoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
