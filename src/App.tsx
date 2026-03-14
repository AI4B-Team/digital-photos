import { Toaster }             from "@/components/ui/toaster";
import { Toaster as Sonner }   from "@/components/ui/sonner";
import { TooltipProvider }     from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider }     from "@/context/SessionContext";
import Index                   from "./pages/Index";
import Checkout                from "./pages/Checkout";
import Delivery                from "./pages/Delivery";
import NotFound                from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/"         element={<Index />} />
            <Route path="/create"   element={<Navigate to="/" replace />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="*"         element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionProvider>
  </QueryClientProvider>
);

export default App;
