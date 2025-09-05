// Simple fetch wrapper for the mobile app
// - Builds a reasonable BASE_URL from Expo or defaults
// - Handles JSON vs non-JSON responses
// - Properly handles FormData / URLSearchParams bodies (no forced Content-Type)
// - Provides ApiError with status + parsed info
import type { ApiLoginSuccess, BackendUser, HttpMethod, LoginPayload } from '@/src/modules/auth/types';
import { useAuthStore } from '@/src/stores/useAuthStore';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
export type { ApiLoginSuccess, BackendRole, BackendUser, HttpMethod, LoginPayload } from '@/src/modules/auth/types';

const DEFAULT_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000', // Android emulator -> host machine
  ios: 'http://localhost:8000',
  default: 'http://localhost:8000',
}) as string;

function deriveBaseUrlFromExpo(): string | undefined {
  try {
    const c = Constants as any;
    const hostUri = c?.expoConfig?.hostUri || c?.manifest?.debuggerHost || c?.debuggerHost;
    if (!hostUri || typeof hostUri !== 'string') return undefined;
    const host = hostUri.split(':')[0];
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return `http://${host}:8000`;
  } catch {
    // ignore
  }
  return undefined;
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || deriveBaseUrlFromExpo() || DEFAULT_BASE_URL;
if (typeof __DEV__ !== 'undefined' && __DEV__) {
  // eslint-disable-next-line no-console
  console.log('[api] BASE_URL =', BASE_URL);
}


export class ApiError extends Error {
  status: number;
  info: unknown;
  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.info = info;
  }
}

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  // ensure leading slash
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${p}`;
}

function isJsonContentType(contentType: string | null) {
  return !!contentType && contentType.toLowerCase().includes('application/json');
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get('content-type');
  if (isJsonContentType(contentType)) {
    // try parse JSON, fallback to null
    return await res.json().catch(() => null);
  }
  // for non-json try text; some endpoints return empty body
  const text = await res.text().catch(() => '');
  return text === '' ? null : text;
}

function shouldStringifyBody(body: unknown) {
  if (body == null) return false;
  if (typeof body === 'string') return false;
  if (typeof FormData !== 'undefined' && body instanceof FormData) return false;
  if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) return false;
  // leave blobs, streams, arrays as-is
  return true;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    token?: string | null;
    signal?: AbortSignal;
  } = {}
): Promise<T> {
  const { method = 'GET', body, headers, token, signal } = options;
  const url = buildUrl(path);

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers ?? {}),
  };

  // Only set Content-Type when we will stringify the body to JSON.
  const willStringify = shouldStringifyBody(body);
  if (willStringify) finalHeaders['Content-Type'] = 'application/json';
  if (token) finalHeaders['Authorization'] = `Bearer ${token}`;

  const payload = willStringify && body !== undefined ? JSON.stringify(body) : (body as any | undefined);

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: payload,
    signal,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const message = (data && typeof data === 'object' && (data as any).message) || (data && typeof data === 'string' ? data : `Request failed with status ${res.status}`);
    throw new ApiError(message as string, res.status, data);
  }

  return data as T;
}





export async function apiLogin(payload: LoginPayload): Promise<ApiLoginSuccess> {
  // Reuse apiFetch so error parsing logic is consistent
  return apiFetch<ApiLoginSuccess>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

// Helper that automatically attaches the auth token from the store
export async function apiFetchAuth<T = unknown>(
  path: string,
  options: Omit<Parameters<typeof apiFetch<T>>[1], 'token'> = {}
) {
  const token = useAuthStore.getState().token;
  return apiFetch<T>(path, { ...options, token });
}

// Logout the current user (Bearer token required)
export async function apiLogout(): Promise<{ message?: string } | null> {
  return apiFetchAuth<{ message?: string } | null>('/auth/logout', {
    method: 'POST',
  });
}

// Fetch authenticated user profile
export type ApiMeResponse = {
  message: string;
  data: { user: BackendUser };
};

export async function apiMe(): Promise<ApiMeResponse> {
  return apiFetchAuth<ApiMeResponse>('/auth/me', { method: 'GET' });
}
