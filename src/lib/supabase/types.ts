/**
 * Hand-authored to mirror supabase/migrations/*.sql exactly.
 *
 * Once you have a live Supabase project linked, regenerate this file from
 * the real schema instead of hand-editing it:
 *
 *   npx supabase gen types typescript --linked > src/lib/supabase/types.ts
 */

export type UserRole = "member" | "approver" | "admin" | "super_admin";
export type Campus = "Zentrum" | "Irchel" | "Oerlikon";
export type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled";
export type EnquiryStatus = "new" | "responded" | "closed";

type Row<T> = T;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Row<{
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
        }>;
        Insert: never; // rows are created only by the handle_new_user() trigger
        Update: { full_name?: string | null };
        Relationships: [];
      };
      buildings: {
        Row: Row<{
          id: string;
          code: string;
          name: string;
          address: string;
          campus: Campus;
        }>;
        Insert: Omit<Database["public"]["Tables"]["buildings"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["buildings"]["Insert"]>;
        Relationships: [];
      };
      room_types: {
        Row: Row<{
          id: string;
          slug: string;
          name: string;
          description: string | null;
        }>;
        Insert: Omit<Database["public"]["Tables"]["room_types"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["room_types"]["Insert"]>;
        Relationships: [];
      };
      rooms: {
        Row: Row<{
          id: string;
          code: string;
          name: string;
          short_code: string;
          building_id: string;
          room_type_id: string | null;
          capacity: number;
          description: string;
          features: string[];
          image_url: string;
          image_alt: string;
          image_credit: string | null;
          source_url: string | null;
          uniability_url: string | null;
          visual_3d_urls: string[];
          seating_style: string[];
          has_projector: boolean;
          has_whiteboard: boolean;
          has_video_conferencing: boolean;
          has_natural_light: boolean;
          wheelchair_accessible: boolean;
          hearing_loop: boolean;
          steps_inside_room: boolean | null;
          door_width_cm: number | null;
          reserved_wheelchair_seats: number | null;
          accessibility_notes: string | null;
          accessibility_details: Record<string, string> | null;
          requires_approval: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        }>;
        Insert: Pick<
          Database["public"]["Tables"]["rooms"]["Row"],
          | "code"
          | "name"
          | "short_code"
          | "building_id"
          | "capacity"
          | "description"
          | "image_url"
          | "image_alt"
        > &
          Partial<
            Omit<
              Database["public"]["Tables"]["rooms"]["Row"],
              | "id"
              | "created_at"
              | "updated_at"
              | "code"
              | "name"
              | "short_code"
              | "building_id"
              | "capacity"
              | "description"
              | "image_url"
              | "image_alt"
            >
          >;
        Update: Partial<Database["public"]["Tables"]["rooms"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "rooms_building_id_fkey";
            columns: ["building_id"];
            isOneToOne: false;
            referencedRelation: "buildings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rooms_room_type_id_fkey";
            columns: ["room_type_id"];
            isOneToOne: false;
            referencedRelation: "room_types";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: Row<{
          id: string;
          room_id: string;
          user_id: string;
          date: string;
          start_time: string;
          end_time: string;
          attendees: number | null;
          purpose: string | null;
          status: BookingStatus;
          decided_by: string | null;
          decided_at: string | null;
          decision_note: string | null;
          created_at: string;
          updated_at: string;
        }>;
        Insert: never; // always created via the create_booking() RPC
        Update: { status?: BookingStatus }; // client-side use: cancelling one's own booking
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_decided_by_fkey";
            columns: ["decided_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      enquiries: {
        Row: Row<{
          id: string;
          room_id: string | null;
          name: string;
          email: string;
          message: string;
          status: EnquiryStatus;
          created_at: string;
        }>;
        Insert: Omit<
          Database["public"]["Tables"]["enquiries"]["Row"],
          "id" | "status" | "created_at"
        >;
        Update: Partial<Pick<Database["public"]["Tables"]["enquiries"]["Row"], "status">>;
        Relationships: [
          {
            foreignKeyName: "enquiries_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      email_log: {
        Row: Row<{
          id: string;
          booking_id: string | null;
          to_email: string;
          template: string;
          status: string;
          error: string | null;
          created_at: string;
        }>;
        Insert: never;
        Update: never;
        Relationships: [
          {
            foreignKeyName: "email_log_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_role: {
        Args: Record<string, never>;
        Returns: UserRole | null;
      };
      admin_set_user_role: {
        Args: { target_user_id: string; new_role: UserRole };
        Returns: void;
      };
      create_booking: {
        Args: {
          p_room_id: string;
          p_date: string;
          p_start_time: string;
          p_end_time: string;
          p_attendees?: number | null;
          p_purpose?: string | null;
          p_instant?: boolean;
        };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
      decide_booking: {
        Args: { p_booking_id: string; p_status: BookingStatus; p_note?: string | null };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
      get_busy_slots: {
        Args: { p_room_ids: string[]; p_from: string; p_to: string };
        Returns: { room_id: string; date: string; start_time: string; end_time: string }[];
      };
    };
    Enums: {
      user_role: UserRole;
      campus: Campus;
      booking_status: BookingStatus;
      enquiry_status: EnquiryStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
