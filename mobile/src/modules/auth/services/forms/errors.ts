import type { LoginFormValues } from '@/lib/validation/auth';
import { ApiError } from '@/src/modules/auth/services/api';
import type { UseFormSetError } from 'react-hook-form';

function looksLikeEmail(message?: string | null) {
  if (!message) return false;
  const s = String(message).toLowerCase();
  return s.includes('email') || s.includes('e-mail') || s.includes('courriel') || s.includes('adresse');
}

export function mapAuthApiErrorsToLoginForm(setError: UseFormSetError<LoginFormValues>, err: unknown) {
  const anyErr = err as any;
  const status: number | undefined = anyErr?.status;
  const info = (anyErr instanceof ApiError ? anyErr.info : anyErr?.info) as any;
  const body = info && typeof info === 'object' && info.data && typeof info.data === 'object' ? info.data : info;
  const message = (body && (body.message || body.error)) || (info && info.message) || (anyErr?.message as string | undefined);

  if (status === 422 && body && typeof body === 'object' && body.errors) {
    const errorsObj = body.errors as Record<string, string[] | string>;
    const first = (val: string[] | string | undefined) => Array.isArray(val) ? val[0] : val;
    const emailMsg = first(errorsObj.email);
    const passMsg = first(errorsObj.password);
    if (emailMsg) setError('email', { type: 'server', message: String(emailMsg) });
    if (passMsg) setError('password', { type: 'server', message: String(passMsg) });
    if (!passMsg && (errorsObj as any).credentials) {
      const v = (errorsObj as any).credentials;
      setError('password', { type: 'server', message: String(Array.isArray(v) ? v[0] : v) });
    }
    const globalMsg = body.message || (info && info.message);
    if (!emailMsg && !passMsg && globalMsg) {
      if ((body as any)?.field === 'email' || looksLikeEmail(globalMsg)) setError('email', { type: 'server', message: String(globalMsg) });
      else setError('password', { type: 'server', message: String(globalMsg) });
    }
    return;
  }

  if (status === 401 || status === 400) {
    if ((body as any)?.field === 'email' || looksLikeEmail(message)) {
      setError('email', { type: 'server', message: message || 'Adresse email invalide.' });
    } else {
      setError('password', { type: 'server', message: message || (status === 401 ? 'Email ou mot de passe incorrect.' : 'Requête invalide.') });
    }
    return;
  }

  if (message) {
    if ((body as any)?.field === 'email' || looksLikeEmail(message)) setError('email', { type: 'server', message });
    else setError('password', { type: 'server', message });
  } else {
    setError('password', { type: 'server', message: 'Une erreur est survenue. Réessayez.' });
  }
}
