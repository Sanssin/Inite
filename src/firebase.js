// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX3jaBpyaDmjazSYDRT9V75SPN2Oaku6E",
  authDomain: "inite-react.firebaseapp.com",
  projectId: "inite-react",
  storageBucket: "inite-react.firebasestorage.app",
  messagingSenderId: "45559487739",
  appId: "1:45559487739:web:219b64e04ec44cffc9a45e",
  measurementId: "G-62HYHPW4LY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;