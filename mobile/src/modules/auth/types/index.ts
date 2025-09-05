export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type LoginPayload = { email: string; password: string };

export type BackendRole = {
  role_id: number;
  role_name: string;
  display_name: string;
  role_description?: string | null;
  permissions?: Record<string, boolean>;
  created_at?: string | null;
  updated_at?: string | null;
};

export type BackendUser = {
  user_id: number;
  matriculation_number?: string | null;
  matriculation_info?: { prefix?: string | null; year?: number | null; sequence?: number | null };
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  display_name: string;
  email: string;
  email_verified?: boolean;
  email_verified_at?: string | null;
  avatar?: { path: string; url: string | null };
  phone?: string | null;
  has_phone?: boolean;
  role_id?: number;
  role?: BackendRole;
  is_active?: boolean;
  last_login_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  profile_completion?: number;
  account_age_days?: number;
  [key: string]: any;
};

export type ApiLoginSuccess = {
  message: string;
  data: {
    user: BackendUser;
    token: string;
  };
};
