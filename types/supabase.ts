export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chats: {
        Row: {
          chat_type: string
          created_at: string | null
          group_info: Json | null
          jid: string
          last_message_time: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          chat_type: string
          created_at?: string | null
          group_info?: Json | null
          jid: string
          last_message_time?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          chat_type?: string
          created_at?: string | null
          group_info?: Json | null
          jid?: string
          last_message_time?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      message_summaries: {
        Row: {
          chat_jid: string | null
          created_at: string | null
          id: string
          message_count: number
          participants_involved: string[] | null
          summary_content: string
          summary_period_end: string | null
          summary_period_start: string | null
          summary_type: string
        }
        Insert: {
          chat_jid?: string | null
          created_at?: string | null
          id?: string
          message_count: number
          participants_involved?: string[] | null
          summary_content: string
          summary_period_end?: string | null
          summary_period_start?: string | null
          summary_type: string
        }
        Update: {
          chat_jid?: string | null
          created_at?: string | null
          id?: string
          message_count?: number
          participants_involved?: string[] | null
          summary_content?: string
          summary_period_end?: string | null
          summary_period_start?: string | null
          summary_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_summaries_chat_jid_fkey"
            columns: ["chat_jid"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["jid"]
          },
        ]
      }
      messages: {
        Row: {
          chat_jid: string
          content: string | null
          created_at: string | null
          forwarded_from: string | null
          id: string
          is_from_me: boolean | null
          media_info: Json | null
          message_type: string | null
          reply_to: string | null
          sender_jid: string | null
          sender_name: string | null
          timestamp: string
        }
        Insert: {
          chat_jid: string
          content?: string | null
          created_at?: string | null
          forwarded_from?: string | null
          id: string
          is_from_me?: boolean | null
          media_info?: Json | null
          message_type?: string | null
          reply_to?: string | null
          sender_jid?: string | null
          sender_name?: string | null
          timestamp: string
        }
        Update: {
          chat_jid?: string
          content?: string | null
          created_at?: string | null
          forwarded_from?: string | null
          id?: string
          is_from_me?: boolean | null
          media_info?: Json | null
          message_type?: string | null
          reply_to?: string | null
          sender_jid?: string | null
          sender_name?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_jid_fkey"
            columns: ["chat_jid"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["jid"]
          },
          {
            foreignKeyName: "messages_sender_jid_fkey"
            columns: ["sender_jid"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["jid"]
          },
        ]
      }
      people: {
        Row: {
          company: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          first_name: string | null
          is_decision_maker: boolean | null
          jid: string
          last_name: string | null
          last_seen: string | null
          notes: string | null
          phone_number: string | null
          role: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          is_decision_maker?: boolean | null
          jid: string
          last_name?: string | null
          last_seen?: string | null
          notes?: string | null
          phone_number?: string | null
          role?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          is_decision_maker?: boolean | null
          jid?: string
          last_name?: string | null
          last_seen?: string | null
          notes?: string | null
          phone_number?: string | null
          role?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      people_interactions: {
        Row: {
          chat_jid: string | null
          created_at: string | null
          first_message_time: string | null
          id: string
          interaction_date: string
          last_message_time: string | null
          message_count: number | null
          person_jid: string | null
        }
        Insert: {
          chat_jid?: string | null
          created_at?: string | null
          first_message_time?: string | null
          id?: string
          interaction_date: string
          last_message_time?: string | null
          message_count?: number | null
          person_jid?: string | null
        }
        Update: {
          chat_jid?: string | null
          created_at?: string | null
          first_message_time?: string | null
          id?: string
          interaction_date: string
          last_message_time?: string | null
          message_count?: number | null
          person_jid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_interactions_chat_jid_fkey"
            columns: ["chat_jid"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["jid"]
          },
          {
            foreignKeyName: "people_interactions_person_jid_fkey"
            columns: ["person_jid"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["jid"]
          },
        ]
      }
      scheduled_messages: {
        Row: {
          chat_jid: string | null
          created_at: string | null
          id: string
          message_content: string
          retry_count: number | null
          scheduled_for: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          chat_jid?: string | null
          created_at?: string | null
          id?: string
          message_content: string
          retry_count?: number | null
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          chat_jid?: string | null
          created_at?: string | null
          id?: string
          message_content?: string
          retry_count?: number | null
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_messages_chat_jid_fkey"
            columns: ["chat_jid"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["jid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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