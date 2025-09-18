import { 
  getAuth, 
  signInWithRedirect, 
  getRedirectResult, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export function signInWithGoogle() {
  return signInWithRedirect(auth, provider);
}

export function signOut() {
  return firebaseSignOut(auth);
}

export function handleRedirect() {
  return getRedirectResult(auth);
}

export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
