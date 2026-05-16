export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      client_previews: {
        Row: {
          category: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          ordered: boolean
          ordered_at: string | null
          portraits: Json
          session_id: string | null
          source_photo_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          ordered?: boolean
          ordered_at?: string | null
          portraits?: Json
          session_id?: string | null
          source_photo_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          ordered?: boolean
          ordered_at?: string | null
          portraits?: Json
          session_id?: string | null
          source_photo_url?: string | null
        }
        Relationships: []
      }
      lead_captures: {
        Row: {
          category: string | null
          created_at: string
          email: string
          id: string
          session_id: string | null
          source: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          email: string
          id?: string
          session_id?: string | null
          source?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          email?: string
          id?: string
          session_id?: string | null
          source?: string | null
        }
        Relationships: []
      }
      portraits: {
        Row: {
          created_at: string | null
          id: string
          session_id: string | null
          style: string | null
          url: string | null
          url_hd: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id?: string | null
          style?: string | null
          url?: string | null
          url_hd?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string | null
          style?: string | null
          url?: string | null
          url_hd?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portraits_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      preview_reminder_log: {
        Row: {
          email: string
          id: string
          preview_id: string
          queued_at: string
          reminder_type: string
          status: string
        }
        Insert: {
          email: string
          id?: string
          preview_id: string
          queued_at?: string
          reminder_type: string
          status?: string
        }
        Update: {
          email?: string
          id?: string
          preview_id?: string
          queued_at?: string
          reminder_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "preview_reminder_log_preview_id_fkey"
            columns: ["preview_id"]
            isOneToOne: false
            referencedRelation: "client_previews"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          category: string | null
          created_at: string | null
          customer_email: string | null
          id: string
          order_id: string | null
          order_product: string | null
          photo_url: string | null
          print_frame: string | null
          print_size: string | null
          print_sku: string | null
          prodigi_order_id: string | null
          prodigi_status: string | null
          shipped_at: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_email: string | null
          shipping_line1: string | null
          shipping_name: string | null
          shipping_zip: string | null
          status: string | null
          stripe_session_id: string | null
          styles: string[] | null
          tracking_url: string | null
          user_email: string | null
          user_id: string | null
          vip_purchased: boolean | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          customer_email?: string | null
          id?: string
          order_id?: string | null
          order_product?: string | null
          photo_url?: string | null
          print_frame?: string | null
          print_size?: string | null
          print_sku?: string | null
          prodigi_order_id?: string | null
          prodigi_status?: string | null
          shipped_at?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_email?: string | null
          shipping_line1?: string | null
          shipping_name?: string | null
          shipping_zip?: string | null
          status?: string | null
          stripe_session_id?: string | null
          styles?: string[] | null
          tracking_url?: string | null
          user_email?: string | null
          user_id?: string | null
          vip_purchased?: boolean | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          customer_email?: string | null
          id?: string
          order_id?: string | null
          order_product?: string | null
          photo_url?: string | null
          print_frame?: string | null
          print_size?: string | null
          print_sku?: string | null
          prodigi_order_id?: string | null
          prodigi_status?: string | null
          shipped_at?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_email?: string | null
          shipping_line1?: string | null
          shipping_name?: string | null
          shipping_zip?: string | null
          status?: string | null
          stripe_session_id?: string | null
          styles?: string[] | null
          tracking_url?: string | null
          user_email?: string | null
          user_id?: string | null
          vip_purchased?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          email_sent: boolean | null
          event_type: string | null
          id: string
          payload: Json | null
          processed_at: string | null
          prodigi_order_id: string | null
          session_id: string | null
          source: string
        }
        Insert: {
          email_sent?: boolean | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed_at?: string | null
          prodigi_order_id?: string | null
          session_id?: string | null
          source?: string
        }
        Update: {
          email_sent?: boolean | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed_at?: string | null
          prodigi_order_id?: string | null
          session_id?: string | null
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
