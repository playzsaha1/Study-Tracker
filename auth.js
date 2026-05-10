import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyACxwc0jBDxsnY3fhwlGmLN8ShECDpA1l4",
  authDomain: "studytrack-ddf21.firebaseapp.com",
  projectId: "studytrack-ddf21",
  storageBucket: "studytrack-ddf21.firebasestorage.app",
  messagingSenderId: "1066736405928",
  appId: "1:1066736405928:web:1e6dcd8cf958fd8e2ca19d"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const authMessage = document.getElementById("authMessage");

window.signup = async function () {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  authMessage.textContent = "";

  if (!email || !password) {
    authMessage.textContent = "Please enter an email and password.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "app.html";
  } catch (error) {
    console.error(error);

    if (error.code === "auth/email-already-in-use") {
      authMessage.textContent = "This email already has an account. Please log in instead.";
    } else if (error.code === "auth/weak-password") {
      authMessage.textContent = "Password must be at least 6 characters.";
    } else if (error.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key.") {
      authMessage.textContent = "Firebase API key issue. Check your Firebase config.";
    } else {
      authMessage.textContent = error.message;
    }
  }
};

window.login = async function () {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  authMessage.textContent = "";

  if (!email || !password) {
    authMessage.textContent = "Please enter your email and password.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "app.html";
  } catch (error) {
    console.error(error);
    authMessage.textContent = "Login failed. Check your email or password.";
  }
};

onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.includes("index.html")) {
    window.location.href = "app.html";
  }
});