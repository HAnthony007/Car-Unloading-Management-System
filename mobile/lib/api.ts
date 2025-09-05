export type LoginPayload = { email: string; password: string };

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiLogin(payload: LoginPayload) {
  // Placeholder: integrate with Laravel API later
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Login failed');
  }
  return res.json();
}
