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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          attendees: number | null
          created_at: string
          date: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          during: unknown
          end_time: string
          id: string
          modified_at: string | null
          modified_by: string | null
          purpose: string | null
          room_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: number | null
          created_at?: string
          date: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          during?: unknown
          end_time: string
          id?: string
          modified_at?: string | null
          modified_by?: string | null
          purpose?: string | null
          room_id: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: number | null
          created_at?: string
          date?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          during?: unknown
          end_time?: string
          id?: string
          modified_at?: string | null
          modified_by?: string | null
          purpose?: string | null
          room_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_decided_by_fkey"
            columns: ["decided_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_modified_by_fkey"
            columns: ["modified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings: {
        Row: {
          address: string
          campus: Database["public"]["Enums"]["campus"]
          code: string
          id: string
          name: string
        }
        Insert: {
          address: string
          campus: Database["public"]["Enums"]["campus"]
          code: string
          id?: string
          name: string
        }
        Update: {
          address?: string
          campus?: Database["public"]["Enums"]["campus"]
          code?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      email_log: {
        Row: {
          booking_id: string | null
          created_at: string
          error: string | null
          id: string
          status: string
          template: string
          to_email: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          status?: string
          template: string
          to_email: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          status?: string
          template?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_log_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          room_id: string | null
          status: Database["public"]["Enums"]["enquiry_status"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          room_id?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          room_id?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      room_types: {
        Row: {
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          accessibility_details: Json | null
          accessibility_notes: string | null
          building_id: string
          capacity: number
          code: string
          created_at: string
          description: string
          door_width_cm: number | null
          features: string[]
          has_natural_light: boolean
          has_projector: boolean
          has_video_conferencing: boolean
          has_whiteboard: boolean
          hearing_loop: boolean
          id: string
          image_alt: string
          image_credit: string | null
          image_url: string
          is_active: boolean
          name: string
          requires_approval: boolean
          reserved_wheelchair_seats: number | null
          room_type_id: string | null
          seating_style: string[]
          short_code: string
          source_url: string | null
          steps_inside_room: boolean | null
          uniability_url: string | null
          updated_at: string
          visual_3d_urls: string[]
          wheelchair_accessible: boolean
        }
        Insert: {
          accessibility_details?: Json | null
          accessibility_notes?: string | null
          building_id: string
          capacity: number
          code: string
          created_at?: string
          description: string
          door_width_cm?: number | null
          features?: string[]
          has_natural_light?: boolean
          has_projector?: boolean
          has_video_conferencing?: boolean
          has_whiteboard?: boolean
          hearing_loop?: boolean
          id?: string
          image_alt: string
          image_credit?: string | null
          image_url: string
          is_active?: boolean
          name: string
          requires_approval?: boolean
          reserved_wheelchair_seats?: number | null
          room_type_id?: string | null
          seating_style?: string[]
          short_code: string
          source_url?: string | null
          steps_inside_room?: boolean | null
          uniability_url?: string | null
          updated_at?: string
          visual_3d_urls?: string[]
          wheelchair_accessible?: boolean
        }
        Update: {
          accessibility_details?: Json | null
          accessibility_notes?: string | null
          building_id?: string
          capacity?: number
          code?: string
          created_at?: string
          description?: string
          door_width_cm?: number | null
          features?: string[]
          has_natural_light?: boolean
          has_projector?: boolean
          has_video_conferencing?: boolean
          has_whiteboard?: boolean
          hearing_loop?: boolean
          id?: string
          image_alt?: string
          image_credit?: string | null
          image_url?: string
          is_active?: boolean
          name?: string
          requires_approval?: boolean
          reserved_wheelchair_seats?: number | null
          room_type_id?: string | null
          seating_style?: string[]
          short_code?: string
          source_url?: string | null
          steps_inside_room?: boolean | null
          uniability_url?: string | null
          updated_at?: string
          visual_3d_urls?: string[]
          wheelchair_accessible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "rooms_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_set_user_role: {
        Args: {
          new_role: Database["public"]["Enums"]["user_role"]
          target_user_id: string
        }
        Returns: undefined
      }
      admin_update_booking: {
        Args: {
          p_attendees?: number
          p_booking_id: string
          p_date: string
          p_end_time: string
          p_purpose?: string
          p_start_time: string
        }
        Returns: {
          attendees: number | null
          created_at: string
          date: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          during: unknown
          end_time: string
          id: string
          modified_at: string | null
          modified_by: string | null
          purpose: string | null
          room_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_booking: {
        Args: {
          p_attendees?: number
          p_date: string
          p_end_time: string
          p_instant?: boolean
          p_purpose?: string
          p_room_id: string
          p_start_time: string
        }
        Returns: {
          attendees: number | null
          created_at: string
          date: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          during: unknown
          end_time: string
          id: string
          modified_at: string | null
          modified_by: string | null
          purpose: string | null
          room_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      decide_booking: {
        Args: {
          p_booking_id: string
          p_note?: string
          p_status: Database["public"]["Enums"]["booking_status"]
        }
        Returns: {
          attendees: number | null
          created_at: string
          date: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          during: unknown
          end_time: string
          id: string
          modified_at: string | null
          modified_by: string | null
          purpose: string | null
          room_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_busy_slots: {
        Args: { p_from: string; p_room_ids: string[]; p_to: string }
        Returns: Database["public"]["CompositeTypes"]["busy_slot"][]
        SetofOptions: {
          from: "*"
          to: "busy_slot"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      update_own_booking: {
        Args: {
          p_attendees?: number
          p_booking_id: string
          p_date: string
          p_end_time: string
          p_purpose?: string
          p_start_time: string
        }
        Returns: {
          attendees: number | null
          created_at: string
          date: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          during: unknown
          end_time: string
          id: string
          modified_at: string | null
          modified_by: string | null
          purpose: string | null
          room_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "rejected" | "cancelled"
      campus: "Zentrum" | "Irchel" | "Oerlikon"
      enquiry_status: "new" | "responded" | "closed"
      user_role: "member" | "approver" | "admin" | "super_admin"
    }
    CompositeTypes: {
      busy_slot: {
        room_id: string | null
        date: string | null
        start_time: string | null
        end_time: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      booking_status: ["pending", "confirmed", "rejected", "cancelled"],
      campus: ["Zentrum", "Irchel", "Oerlikon"],
      enquiry_status: ["new", "responded", "closed"],
      user_role: ["member", "approver", "admin", "super_admin"],
    },
  },
} as const

// Convenience aliases — every call site elsewhere in the app imports these
// short names rather than reaching into Database["public"]["Enums"] every
// time. Keep these in sync whenever `npm run supabase:types` regenerates
// the rest of this file.
export type UserRole = Database["public"]["Enums"]["user_role"]
export type Campus = Database["public"]["Enums"]["campus"]
export type BookingStatus = Database["public"]["Enums"]["booking_status"]
export type EnquiryStatus = Database["public"]["Enums"]["enquiry_status"]
