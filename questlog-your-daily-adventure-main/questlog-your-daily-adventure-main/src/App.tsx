import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/game/store";
import { AppLayout } from "@/components/AppLayout";
import Home from "./pages/Home";
import Quests from "./pages/Quests";
import TimerPage from "./pages/TimerPage";
import Analytics from "./pages/Analytics";
import Skills from "./pages/Skills";
import Settings from "./pages/Settings";
import Learn from "./pages/Learn";
import CoursePlayer from "./pages/CoursePlayer";
import Feed from "./pages/Feed";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner theme="dark" position="top-right" toastOptions={{ className: "panel" }} />
      <GameProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/timer" element={<TimerPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/:courseId" element={<CoursePlayer />} />
              <Route path="/content" element={<Feed />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
