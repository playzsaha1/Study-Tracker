import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

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
const db = getFirestore(app);

let currentUserId = null;

let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;

let timerInterval = null;
let running = false;

const timerDisplay = document.getElementById("timer");
const subjectInput = document.getElementById("subject");
const totalTimeDisplay = document.getElementById("totalTime");
const todayTimeDisplay = document.getElementById("todayTime");
const sessionCountDisplay = document.getElementById("sessionCount");
const sessionList = document.getElementById("sessionList");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUserId = user.uid;

  await loadSessions();
});

function updateTimer() {

  milliseconds += 10;

  if (milliseconds >= 1000) {
    milliseconds = 0;
    seconds++;
  }

  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }

  if (minutes >= 60) {
    minutes = 0;
    hours++;
  }

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  const formattedMilliseconds = String(milliseconds).padStart(3, "0");

  timerDisplay.textContent =
    `${formattedHours} : ${formattedMinutes} : ${formattedSeconds} : ${formattedMilliseconds}`;
}

function formatStudyTime(totalSeconds) {

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);

  return `${h}h ${m}m`;
}

window.startTimer = function () {

  if (running) return;

  running = true;

  timerInterval = setInterval(updateTimer, 10);
};

window.pauseTimer = function () {

  clearInterval(timerInterval);

  running = false;
};

window.resetTimer = function () {

  clearInterval(timerInterval);

  running = false;

  milliseconds = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;

  timerDisplay.textContent =
    "00 : 00 : 00 : 000";
};

window.stopAndSave = async function () {

  if (
    hours === 0 &&
    minutes === 0 &&
    seconds === 0
  ) {
    alert("Start the stopwatch first.");
    return;
  }

  clearInterval(timerInterval);

  running = false;

  const totalSeconds =
    (hours * 3600) +
    (minutes * 60) +
    seconds;

  const subject =
    subjectInput.value.trim() ||
    "General Study";

  const today =
    new Date().toISOString().split("T")[0];

  await addDoc(
    collection(db, "users", currentUserId, "sessions"),
    {
      subject: subject,
      durationSeconds: totalSeconds,
      date: today,
      createdAt: serverTimestamp()
    }
  );

  milliseconds = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;

  timerDisplay.textContent =
    "00 : 00 : 00 : 000";

  subjectInput.value = "";

  await loadSessions();
};

async function loadSessions() {

  const sessionsRef =
    collection(db, "users", currentUserId, "sessions");

  const q =
    query(sessionsRef, orderBy("createdAt", "desc"));

  const snapshot =
    await getDocs(q);

  let totalSeconds = 0;
  let todaySeconds = 0;
  let sessionCount = 0;

  const today =
    new Date().toISOString().split("T")[0];

  sessionList.innerHTML = "";

  snapshot.forEach((doc) => {

    const session = doc.data();

    totalSeconds += session.durationSeconds;

    sessionCount++;

    if (session.date === today) {
      todaySeconds += session.durationSeconds;
    }

    const item = document.createElement("div");

    item.className = "session-item";

    item.innerHTML = `
      <strong>${session.subject}</strong><br>
      Time: ${formatStudyTime(session.durationSeconds)}<br>
      Date: ${session.date}
    `;

    sessionList.appendChild(item);
  });

  totalTimeDisplay.textContent =
    formatStudyTime(totalSeconds);

  todayTimeDisplay.textContent =
    formatStudyTime(todaySeconds);

  sessionCountDisplay.textContent =
    sessionCount;
}

window.logout = async function () {

  await signOut(auth);

  window.location.href = "index.html";
};

window.logout = async function () {

  await signOut(auth);

  window.location.href = "index.html";
};