import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2JTTYrNLnLK47MmJz1pJ_lvh6qq6BwVI",
  authDomain: "scholarsphere-4f349.firebaseapp.com",
  projectId: "scholarsphere-4f349",
  storageBucket: "scholarsphere-4f349.appspot.com",
  messagingSenderId: "1044441761683",
  appId: "1:1044441761683:web:51b91974f45880e4128a66",
  measurementId: "G-WYHYSHV6RV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
