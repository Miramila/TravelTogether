import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
} from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "./Secrets";

let app, auth;
// this guards against initializing more than one "App"
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}

auth = getAuth(app);

const signIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const signOut = async () => {
  await fbSignOut(auth);
};

const signUp = async (displayName, email, password) => {
  console.log("sarting sign up");
  if (!email || !password) {
    throw new Error("Email and password cannot be empty");
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCred.user, {displayName: displayName});
  } catch (error) {
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  }

  await updateProfile(userCred.user, { displayName: displayName });
};


const getAuthUser = () => {
    console.log("the author is", auth)
    return auth.currentUser;
  }



export { signIn, signOut, signUp, getAuthUser };
