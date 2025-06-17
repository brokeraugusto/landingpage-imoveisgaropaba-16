
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Admin from "./pages/Admin";
import AdminProperties from "./pages/AdminProperties";
import AdminSettings from "./pages/AdminSettings";
import AdminConfig from "./pages/AdminConfig";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Home />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/imoveis" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Properties />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/imovel/:id" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <PropertyDetail />
                  </main>
                  <Footer />
                </>
              } />
              
              {/* Auth route */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected admin routes - require admin role */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/admin/properties" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProperties />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              <Route path="/admin/config" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminConfig />
                </ProtectedRoute>
              } />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
