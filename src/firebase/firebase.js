import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyD1Awb-MYTNE15I6qxRmNtc7H3Y7N9ACrg',
    authDomain: 'killerkc12-build.firebaseapp.com',
    projectId: 'killerkc12-build',
    storageBucket: 'killerkc12-build.firebasestorage.app',
    messagingSenderId: '927295407095',
    appId: '1:927295407095:web:a651affee57c2c560ce4f2',
    measurementId: 'G-D4637QXGQ6'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Offline data: keep a local copy so boards work without a connection; changes sync later.
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

const provider = new GoogleAuthProvider();

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth, provider, db };
