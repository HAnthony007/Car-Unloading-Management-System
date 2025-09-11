export interface LoginCredentials {
    email: string;
    password: string;
}

// Types décrivant le format normalisé dans l'app
export interface UserPermissions {
    is_administrator: boolean;
    can_manage_users: boolean;
    can_view_reports: boolean; // Normalisé même si l'API envoie can_vew_reports (typo)
}

export interface UserRole {
    role_id?: number;
    role_name: string;
    display_name?: string;
    permissions: UserPermissions;
}

export interface MatriculationInfo {
    prefix: string;
    year?: string;
    sequence?: string;
}

export interface User {
    user_id: number;
    matriculation_number: string;
    matriculation_info?: MatriculationInfo;
    full_name: string; // Backend
    email: string;
    phone?: string;
    role: UserRole;
    profile_completion?: number;
    account_age_days?: number;
}

// Réponses réelles de l'API (avant normalisation)
export interface RawLoginResponse {
    message: string;
    data: {
        user: any; // On normalise ensuite
        token: string;
    };
}

export interface RawMeResponse {
    message: string;
    data: {
        user: any;
    };
}

export interface NormalizedAuthData {
    user: User;
    token: string;
}
