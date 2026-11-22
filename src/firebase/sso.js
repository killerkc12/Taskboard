// Single sign-on through auth.killerkc12.in (see that repo's README).
import { signInWithCustomToken, signOut } from 'firebase/auth';

const AUTH = 'https://auth.killerkc12.in';
const LAST_REDIRECT = 'kc_sso_redirect_at';

/** Signs in with the shared killerkc12.in session if there is one. Returns the user or null. */
export async function ssoSignIn(auth) {
  try {
    const r = await fetch(`${AUTH}/api/token`, { credentials: 'include' });
    if (!r.ok) return null;
    const { token } = await r.json();
    const user = (await signInWithCustomToken(auth, token)).user;
    try { sessionStorage.removeItem(LAST_REDIRECT); } catch { /* ignore */ }
    return user;
  } catch {
    return null;
  }
}

/** Sends the visitor to the shared login page and back here afterwards (for sign-in buttons). */
export function goToLogin() {
  window.location.assign(`${AUTH}/?redirect=${encodeURIComponent(window.location.href)}`);
}

/**
 * Automatic redirect for signed-out visitors. Returns false instead of redirecting if we
 * already sent them to the login page in the last minute and they came back without a
 * session, so a broken cookie can't cause an endless redirect loop.
 */
export function redirectToLogin() {
  try {
    const last = Number(sessionStorage.getItem(LAST_REDIRECT) || 0);
    if (Date.now() - last < 60_000) return false;
    sessionStorage.setItem(LAST_REDIRECT, String(Date.now()));
  } catch { /* storage unavailable: redirect anyway */ }
  goToLogin();
  return true;
}

/** Logs out of every killerkc12.in app (guests only log out here). */
export async function ssoSignOut(auth) {
  if (auth.currentUser && !auth.currentUser.isAnonymous) {
    try {
      await fetch(`${AUTH}/api/logout`, { method: 'POST', credentials: 'include' });
    } catch { /* still sign out locally */ }
  }
  await signOut(auth);
}
