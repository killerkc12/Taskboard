import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAIHtUjHEezd-C3z6tdBY3I4ZKQu2lomvk",
    authDomain: "taskboard-3b4aa.firebaseapp.com",
    projectId: "taskboard-3b4aa",
    storageBucket: "taskboard-3b4aa.appspot.com",
    messagingSenderId: "408128814490",
    appId: "1:408128814490:web:9738fec29b08f5a7fd0e23",
    measurementId: "G-1FT668EPSR"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth, provider };
