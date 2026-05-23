export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string;
          posted_at: string;
          role_title: string;
          company: string;
          location: string | null;
          vertical: string;
          description: string | null;
          apply_url: string;
          salary_range: string | null;
          remote: boolean;
        };
        Insert: {
          id?: string;
          posted_at?: string;
          role_title: string;
          company: string;
          location?: string | null;
          vertical: string;
          description?: string | null;
          apply_url: string;
          salary_range?: string | null;
          remote?: boolean;
        };
        Update: {
          id?: string;
          posted_at?: string;
          role_title?: string;
          company?: string;
          location?: string | null;
          vertical?: string;
          description?: string | null;
          apply_url?: string;
          salary_range?: string | null;
          remote?: boolean;
        };
        Relationships: [];
      };
      subscribers: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          vertical: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          vertical?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          vertical?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export type Job = Database["public"]["Tables"]["listings"]["Row"];
export type Subscriber = Database["public"]["Tables"]["subscribers"]["Row"];
