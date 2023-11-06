// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVADGK81ODxrKzJ7kf19FwJnc9rCmdlw4",
  authDomain: "gns-cf.firebaseapp.com",
  projectId: "gns-cf",
  storageBucket: "gns-cf.appspot.com",
  messagingSenderId: "527514455753",
  appId: "1:527514455753:web:89d83b70bf35ed012f4718",
  measurementId: "G-99HPRM2DX5"
}; 

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);