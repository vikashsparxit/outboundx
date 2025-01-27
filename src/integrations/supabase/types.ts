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
      lead_activity_analysis: {
        Row: {
          active_job_postings: number | null
          activity_status:
            | Database["public"]["Enums"]["business_activity_status"]
            | null
          analysis_version: number | null
          confidence_level: string | null
          created_at: string | null
          digital_footprint_details: Json | null
          digital_footprint_score: number | null
          id: string
          job_posting_platforms: Json | null
          last_analyzed_at: string | null
          latest_job_posting_date: string | null
          latest_news_date: string | null
          lead_id: string | null
          news_mentions_count: number | null
          news_sources: Json | null
          social_media_last_activity: string | null
          social_media_notes: string | null
          social_media_platforms: Json | null
          updated_at: string | null
          website_analysis_notes: string | null
          website_last_updated: string | null
          website_status: boolean | null
        }
        Insert: {
          active_job_postings?: number | null
          activity_status?:
            | Database["public"]["Enums"]["business_activity_status"]
            | null
          analysis_version?: number | null
          confidence_level?: string | null
          created_at?: string | null
          digital_footprint_details?: Json | null
          digital_footprint_score?: number | null
          id?: string
          job_posting_platforms?: Json | null
          last_analyzed_at?: string | null
          latest_job_posting_date?: string | null
          latest_news_date?: string | null
          lead_id?: string | null
          news_mentions_count?: number | null
          news_sources?: Json | null
          social_media_last_activity?: string | null
          social_media_notes?: string | null
          social_media_platforms?: Json | null
          updated_at?: string | null
          website_analysis_notes?: string | null
          website_last_updated?: string | null
          website_status?: boolean | null
        }
        Update: {
          active_job_postings?: number | null
          activity_status?:
            | Database["public"]["Enums"]["business_activity_status"]
            | null
          analysis_version?: number | null
          confidence_level?: string | null
          created_at?: string | null
          digital_footprint_details?: Json | null
          digital_footprint_score?: number | null
          id?: string
          job_posting_platforms?: Json | null
          last_analyzed_at?: string | null
          latest_job_posting_date?: string | null
          latest_news_date?: string | null
          lead_id?: string | null
          news_mentions_count?: number | null
          news_sources?: Json | null
          social_media_last_activity?: string | null
          social_media_notes?: string | null
          social_media_platforms?: Json | null
          updated_at?: string | null
          website_analysis_notes?: string | null
          website_last_updated?: string | null
          website_status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activity_analysis_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_discoveries: {
        Row: {
          applied: boolean | null
          applied_at: string | null
          applied_by: string | null
          confidence_level: Database["public"]["Enums"]["discovery_confidence"]
          created_at: string | null
          discovered_value: string
          field_name: string
          id: string
          lead_id: string | null
          metadata: Json | null
          source: string | null
          verification_notes: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          applied?: boolean | null
          applied_at?: string | null
          applied_by?: string | null
          confidence_level: Database["public"]["Enums"]["discovery_confidence"]
          created_at?: string | null
          discovered_value: string
          field_name: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          source?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          applied?: boolean | null
          applied_at?: string | null
          applied_by?: string | null
          confidence_level?: Database["public"]["Enums"]["discovery_confidence"]
          created_at?: string | null
          discovered_value?: string
          field_name?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          source?: string | null
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_discoveries_applied_by_fkey"
            columns: ["applied_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_discoveries_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_discoveries_verified_by_fkey"
            columns: ["verified_by"]
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
      lead_status_actions: {
        Row: {
          action_type: Database["public"]["Enums"]["lead_status_action_type"]
          created_at: string | null
          duration_minutes: number | null
          id: string
          lead_id: string | null
          notes: string | null
          outcome: Database["public"]["Enums"]["lead_status_outcome"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action_type: Database["public"]["Enums"]["lead_status_action_type"]
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          outcome: Database["public"]["Enums"]["lead_status_outcome"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["lead_status_action_type"]
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          outcome?: Database["public"]["Enums"]["lead_status_outcome"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_status_actions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_status_actions_user_id_fkey"
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
          company_name: string | null
          company_size: string | null
          contact_id: string | null
          country: string | null
          created_at: string | null
          decision_maker_level: string | null
          domain: string | null
          domain_type: Database["public"]["Enums"]["email_domain_type"] | null
          domains: string[] | null
          email: string | null
          email_type: string | null
          emails: Json | null
          engagement_score: number | null
          handled: boolean | null
          id: string
          industry_vertical: string | null
          ip_country: string | null
          ip_region: string | null
          lead_source_website: string | null
          lead_type: string | null
          location: string | null
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
          company_name?: string | null
          company_size?: string | null
          contact_id?: string | null
          country?: string | null
          created_at?: string | null
          decision_maker_level?: string | null
          domain?: string | null
          domain_type?: Database["public"]["Enums"]["email_domain_type"] | null
          domains?: string[] | null
          email?: string | null
          email_type?: string | null
          emails?: Json | null
          engagement_score?: number | null
          handled?: boolean | null
          id?: string
          industry_vertical?: string | null
          ip_country?: string | null
          ip_region?: string | null
          lead_source_website?: string | null
          lead_type?: string | null
          location?: string | null
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
          company_name?: string | null
          company_size?: string | null
          contact_id?: string | null
          country?: string | null
          created_at?: string | null
          decision_maker_level?: string | null
          domain?: string | null
          domain_type?: Database["public"]["Enums"]["email_domain_type"] | null
          domains?: string[] | null
          email?: string | null
          email_type?: string | null
          emails?: Json | null
          engagement_score?: number | null
          handled?: boolean | null
          id?: string
          industry_vertical?: string | null
          ip_country?: string | null
          ip_region?: string | null
          lead_source_website?: string | null
          lead_type?: string | null
          location?: string | null
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
      migration_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          error_log: Json | null
          failed_records: number
          filename: string
          id: string
          processed_records: number
          started_at: string | null
          status: string
          total_records: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          error_log?: Json | null
          failed_records?: number
          filename: string
          id?: string
          processed_records?: number
          started_at?: string | null
          status?: string
          total_records?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          error_log?: Json | null
          failed_records?: number
          filename?: string
          id?: string
          processed_records?: number
          started_at?: string | null
          status?: string
          total_records?: number
        }
        Relationships: [
          {
            foreignKeyName: "migration_jobs_created_by_fkey"
            columns: ["created_by"]
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
      public_email_domains: {
        Row: {
          created_at: string | null
          domain: string
          id: string
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
        }
        Relationships: []
      }
      team_assignments: {
        Row: {
          created_at: string
          id: string
          manager_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          manager_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          manager_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_assignments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_engagement_score: {
        Args: {
          lead_record: unknown
        }
        Returns: number
      }
      recalculate_all_beam_scores: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
      business_activity_status:
        | "active"
        | "semi_active"
        | "dormant"
        | "inactive"
        | "uncertain"
      discovery_confidence: "high" | "medium" | "low"
      email_domain_type: "public" | "business"
      lead_status:
        | "new"
        | "contacted"
        | "in_progress"
        | "closed_won"
        | "closed_lost"
      lead_status_action_type: "call" | "email" | "meeting" | "proposal"
      lead_status_outcome:
        | "connected"
        | "not_connected"
        | "voicemail_left"
        | "wrong_number"
        | "email_sent"
        | "email_received"
        | "no_response"
        | "meeting_scheduled"
        | "meeting_completed"
        | "meeting_cancelled"
        | "proposal_sent"
        | "proposal_accepted"
        | "proposal_rejected"
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
