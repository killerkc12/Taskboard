const auth = { currentUser: { uid: 'u1', displayName: 'Kiran', email: 'k@example.com', photoURL: '' } };
export const getAuth = () => auth;
export class GoogleAuthProvider {}
export const onAuthStateChanged = (_a, cb) => { cb(auth.currentUser); return () => {}; };
export const signInWithCustomToken = async () => ({ user: auth.currentUser });
export const signOut = async () => {};
