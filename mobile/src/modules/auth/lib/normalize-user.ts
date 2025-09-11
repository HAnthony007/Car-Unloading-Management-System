import { User, UserPermissions } from "../type";

export function NormalizeUser(raw: any): User {
    if (!raw) throw new Error("Invalid user payload");

    const permissions = raw.role?.permissions || {};
    const normalizedPermissions: UserPermissions = {
        is_administrator: !!permissions.is_administrator,
        can_manage_users: !!permissions.can_manage_users,
        // L'API envoie can_vew_reports (typo), on fallback
        can_view_reports: !!(
            permissions.can_view_reports ?? permissions.can_vew_reports
        ),
    };

    return {
        user_id: raw.user_id,
        matriculation_number: raw.matriculation_number,
        matriculation_info: raw.matriculation_info,
        full_name: raw.full_name || raw.display_name || raw.fullName || "",
        email: raw.email,
        phone: raw.phone,
        role: {
            role_id: raw.role?.role_id,
            role_name: raw.role?.role_name,
            display_name: raw.role?.display_name,
            permissions: normalizedPermissions,
        },
        profile_completion: raw.profile_completion,
        account_age_days: raw.account_age_days,
    };
}
