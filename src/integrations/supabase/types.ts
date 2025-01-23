export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      lead_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          lead_id: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          lead_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scoring_history: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          new_score: number | null
          previous_score: number | null
          reason: string | null
          score_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          new_score?: number | null
          previous_score?: number | null
          reason?: string | null
          score_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          new_score?: number | null
          previous_score?: number | null
          reason?: string | null
          score_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_scoring_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_scoring_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          account_score: number | null
          annual_revenue_range: string | null
          assigned_to: string | null
          bant_score: number | null
          beam_score: number | null
          bounce_count: number | null
          budget_range: string | null
          call_count: number | null
          city: string | null
          client_type: string | null
          company_size: string | null
          contact_id: string | null
          country: string | null
          created_at: string | null
          decision_maker_level: string | null
          domain: string | null
          email: string | null
          emails: Json | null
          engagement_score: number | null
          handled: boolean | null
          id: string
          industry_vertical: string | null
          ip_country: string | null
          ip_region: string | null
          lead_type: string | null
          market_score: number | null
          message: string | null
          need_urgency: string | null
          phone_numbers: string[] | null
          project_timeline: string | null
          state: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          subject: string | null
          technology_stack: string[] | null
          ticket_id: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          account_score?: number | null
          annual_revenue_range?: string | null
          assigned_to?: string | null
          bant_score?: number | null
          beam_score?: number | null
          bounce_count?: number | null
          budget_range?: string | null
          call_count?: number | null
          city?: string | null
          client_type?: string | null
          company_size?: string | null
          contact_id?: string | null
          country?: string | null
          created_at?: string | null
          decision_maker_level?: string | null
          domain?: string | null
          email?: string | null
          emails?: Json | null
          engagement_score?: number | null
          handled?: boolean | null
          id?: string
          industry_vertical?: string | null
          ip_country?: string | null
          ip_region?: string | null
          lead_type?: string | null
          market_score?: number | null
          message?: string | null
          need_urgency?: string | null
          phone_numbers?: string[] | null
          project_timeline?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          subject?: string | null
          technology_stack?: string[] | null
          ticket_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          account_score?: number | null
          annual_revenue_range?: string | null
          assigned_to?: string | null
          bant_score?: number | null
          beam_score?: number | null
          bounce_count?: number | null
          budget_range?: string | null
          call_count?: number | null
          city?: string | null
          client_type?: string | null
          company_size?: string | null
          contact_id?: string | null
          country?: string | null
          created_at?: string | null
          decision_maker_level?: string | null
          domain?: string | null
          email?: string | null
          emails?: Json | null
          engagement_score?: number | null
          handled?: boolean | null
          id?: string
          industry_vertical?: string | null
          ip_country?: string | null
          ip_region?: string | null
          lead_type?: string | null
          market_score?: number | null
          message?: string | null
          need_urgency?: string | null
          phone_numbers?: string[] | null
          project_timeline?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          subject?: string | null
          technology_stack?: string[] | null
          ticket_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type:
        | "lead_created"
        | "lead_updated"
        | "lead_deleted"
        | "status_changed"
        | "note_added"
        | "note_updated"
        | "note_deleted"
      lead_status:
        | "new"
        | "contacted"
        | "in_progress"
        | "closed_won"
        | "closed_lost"
      user_role: "admin" | "manager" | "executive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
