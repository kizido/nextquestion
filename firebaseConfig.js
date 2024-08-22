import firebase from "firebase/compat/app";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCvV5Zu81kJYe0frpsIXrCGPEDsdDeFPYg",
  authDomain: "hypothetical-a4081.firebaseapp.com",
  projectId: "hypothetical-a4081",
  storageBucket: "hypothetical-a4081.appspot.com",
  messagingSenderId: "1023585025187",
  appId: "1:1023585025187:web:fdf5e150cb92bf2f695316",
  measurementId: "G-ZEEDBTRSHZ",
};

const app = firebase.initializeApp(firebaseConfig);
export default app;