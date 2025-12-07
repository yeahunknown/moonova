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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      blocked_domains: {
        Row: {
          blocked_at: string
          blocked_reason: string | null
          domain: string
          id: string
          last_seen: string | null
        }
        Insert: {
          blocked_at?: string
          blocked_reason?: string | null
          domain: string
          id?: string
          last_seen?: string | null
        }
        Update: {
          blocked_at?: string
          blocked_reason?: string | null
          domain?: string
          id?: string
          last_seen?: string | null
        }
        Relationships: []
      }
      detected_domains: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          is_allowed: boolean | null
          last_seen: string | null
          visit_count: number | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
          is_allowed?: boolean | null
          last_seen?: string | null
          visit_count?: number | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          is_allowed?: boolean | null
          last_seen?: string | null
          visit_count?: number | null
        }
        Relationships: []
      }
      killswitch_config: {
        Row: {
          allowed_domain: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          allowed_domain?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          allowed_domain?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      payment_sessions: {
        Row: {
          amount_expected: number
          amount_received: number | null
          created_at: string
          expires_at: string
          forwarded_tx_hash: string | null
          id: string
          private_key: string
          status: string
          transaction_hash: string | null
          updated_at: string
          wallet_address: string
        }
        Insert: {
          amount_expected?: number
          amount_received?: number | null
          created_at?: string
          expires_at?: string
          forwarded_tx_hash?: string | null
          id?: string
          private_key: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          wallet_address: string
        }
        Update: {
          amount_expected?: number
          amount_received?: number | null
          created_at?: string
          expires_at?: string
          forwarded_tx_hash?: string | null
          id?: string
          private_key?: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      rate_limiting: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          ip_address: unknown
          request_count: number
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          ip_address: unknown
          request_count?: number
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: unknown
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      referral_conversions: {
        Row: {
          id: string
          referral_code: string
          token_created_at: string
        }
        Insert: {
          id?: string
          referral_code: string
          token_created_at?: string
        }
        Update: {
          id?: string
          referral_code?: string
          token_created_at?: string
        }
        Relationships: []
      }
      referral_visits: {
        Row: {
          id: string
          referral_code: string
          visited_at: string
          visitor_ip: string | null
        }
        Insert: {
          id?: string
          referral_code: string
          visited_at?: string
          visitor_ip?: string | null
        }
        Update: {
          id?: string
          referral_code?: string
          visited_at?: string
          visitor_ip?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          level: number
          referral_code: string
          referrer_id: string
          tokens_created: number
          updated_at: string
          visits_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number
          referral_code: string
          referrer_id: string
          tokens_created?: number
          updated_at?: string
          visits_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          referral_code?: string
          referrer_id?: string
          tokens_created?: number
          updated_at?: string
          visits_count?: number
        }
        Relationships: []
      }
      site_visits: {
        Row: {
          domain: string | null
          id: string
          page_path: string | null
          referrer: string | null
          user_agent: string | null
          visited_at: string
          visitor_ip: string | null
        }
        Insert: {
          domain?: string | null
          id?: string
          page_path?: string | null
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
          visitor_ip?: string | null
        }
        Update: {
          domain?: string | null
          id?: string
          page_path?: string | null
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
          visitor_ip?: string | null
        }
        Relationships: []
      }
      trending_tokens_cache: {
        Row: {
          chain: string
          created_at: string
          data: Json
          fetched_at: string
          id: string
          timeframe: string
        }
        Insert: {
          chain?: string
          created_at?: string
          data: Json
          fetched_at?: string
          id?: string
          timeframe?: string
        }
        Update: {
          chain?: string
          created_at?: string
          data?: Json
          fetched_at?: string
          id?: string
          timeframe?: string
        }
        Relationships: []
      }
      user_created_tokens: {
        Row: {
          created_at: string
          id: string
          token_icon: string | null
          token_name: string
          token_supply: string
          token_ticker: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          token_icon?: string | null
          token_name: string
          token_supply: string
          token_ticker: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          token_icon?: string | null
          token_name?: string
          token_supply?: string
          token_ticker?: string
          user_id?: string
        }
        Relationships: []
      }
      user_theme_preferences: {
        Row: {
          created_at: string
          id: string
          theme_color: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          theme_color?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          theme_color?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      referral_codes_public: {
        Row: {
          level: number | null
          referral_code: string | null
        }
        Insert: {
          level?: number | null
          referral_code?: string | null
        }
        Update: {
          level?: number | null
          referral_code?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_trending_tokens_cache: { Args: never; Returns: undefined }
      increment_referral_visits: {
        Args: { referral_code_param: string }
        Returns: undefined
      }
      prune_trending_cache: {
        Args: { max_age_minutes?: number }
        Returns: undefined
      }
      track_referral_conversion: {
        Args: { referral_code_param: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
