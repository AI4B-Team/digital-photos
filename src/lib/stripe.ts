import { supabase } from "@/integrations/supabase/client";

export const PRICE_IDS: Record<string, string> = {
  digital: "price_1TB232GOIj3eWyeW6Y1lBp1T",
  print:   "price_1TB24sGOIj3eWyeWGmDUKN07",
  bundle:  "price_1TB24sGOIj3eWyeWGmDUKN07",
  canvas:  "price_1TB257GOIj3eWyeWKYJ7HFpn",
};

export async function createCheckoutSession(product: string, email?: string) {
  const { data, error } = await supabase.functions.invoke("create-payment", {
    body: { product, email },
  });

  if (error) throw new Error(error.message || "Failed to create checkout session");
  if (!data?.url) throw new Error("No checkout URL returned");

  return data.url as string;
}
