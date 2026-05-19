import { Toaster }             from "@/components/ui/toaster";
import { Toaster as Sonner }   from "@/components/ui/sonner";
import { TooltipProvider }     from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider }     from "@/context/SessionContext";
import { AuthProvider }        from "@/context/AuthContext";
import Index                   from "./pages/Index";
import Checkout                from "./pages/Checkout";
import Customize               from "./pages/Customize";
import Delivery                from "./pages/Delivery";
import Auth                    from "./pages/Auth";
import ResetPassword           from "./pages/ResetPassword";
import Admin                   from "./pages/Admin";
import Styles                  from "./pages/Styles";
import Tracking                from "./pages/Tracking";
import Contact                 from "./pages/Contact";
import Legal                   from "./pages/Legal";
import FAQ                     from "./pages/FAQ";
import GiftCards               from "./pages/GiftCards";
import Reviews                 from "./pages/Reviews";
import NotFound                from "./pages/NotFound";
import CollectionPage          from "./pages/CollectionPage";

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
              <Route path="/landing"        element={<Index />} />
              <Route path="/customize"      element={<Customize />} />
              <Route path="/checkout"       element={<Checkout />} />
              <Route path="/delivery"       element={<Delivery />} />
              <Route path="/auth"           element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin"          element={<Admin />} />
              <Route path="/styles"         element={<Styles />} />
              <Route path="/tracking"       element={<Tracking />} />
              <Route path="/contact"        element={<Contact />} />
              <Route path="/faq"            element={<FAQ />} />
              <Route path="/gift-cards"     element={<GiftCards />} />
              <Route path="/reviews"        element={<Reviews />} />
              <Route path="/privacy"        element={<Legal />} />
              <Route path="/terms"          element={<Legal />} />
              <Route path="/refund"         element={<Legal />} />
              <Route path="/styles-:cat"   element={<Index />} />
              <Route path="*"              element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
