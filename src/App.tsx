import { Toaster }             from "@/components/ui/toaster";
import { Toaster as Sonner }   from "@/components/ui/sonner";
import { TooltipProvider }     from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider }     from "@/context/SessionContext";
import { AuthProvider }        from "@/context/AuthContext";
import Index                   from "./pages/Index";
import Checkout                from "./pages/Checkout";
import Delivery                from "./pages/Delivery";
import Auth                    from "./pages/Auth";
import ResetPassword           from "./pages/ResetPassword";
import Admin                   from "./pages/Admin";
import NotFound                from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SessionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/"               element={<Index />} />
              <Route path="/create"         element={<Navigate to="/" replace />} />
              <Route path="/checkout"       element={<Checkout />} />
              <Route path="/delivery"       element={<Delivery />} />
              <Route path="/auth"           element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin"          element={<Admin />} />
              <Route path="*"              element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
