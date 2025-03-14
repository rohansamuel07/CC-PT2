import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoSiTX_OyOIAVMV8IkKWXynRTUu7YEV0E",
  authDomain: "codecollab962004.firebaseapp.com",
  projectId: "codecollab962004",
  storageBucket: "codecollab962004.appspot.com",  // ✅ Fixed storageBucket
  messagingSenderId: "578778937255",
  appId: "1:578778937255:web:a708bf86be18ee0c9ba882"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
