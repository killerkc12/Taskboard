// Single sign-on through auth.killerkc12.in (see that repo's README).
import { signInWithCustomToken, signOut } from 'firebase/auth';

const AUTH = 'https://auth.killerkc12.in';

/** Signs in with the shared killerkc12.in session if there is one. Returns the user or null. */
export async function ssoSignIn(auth) {
    try {
        const r = await fetch(`${AUTH}/api/token`, { credentials: 'include' });
        if (!r.ok) return null;
        const { token } = await r.json();
        return (await signInWithCustomToken(auth, token)).user;
    } catch {
        return null;
    }
}

/** Sends the visitor to the shared login page and back here afterwards. */
export function goToLogin() {
    window.location.assign(`${AUTH}/?redirect=${encodeURIComponent(window.location.href)}`);
}

/** Logs out of every killerkc12.in app. */
export async function ssoSignOut(auth) {
    try {
        await fetch(`${AUTH}/api/logout`, { method: 'POST', credentials: 'include' });
    } catch { /* still sign out locally */ }
    await signOut(auth);
}
