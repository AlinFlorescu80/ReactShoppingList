import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCnZh5ZRtiSV7dPpzWmDrCe0pWTXHaoZ04",
    authDomain: "reactshoppinglist-c2532.firebaseapp.com",
    projectId: "reactshoppinglist-c2532",
    storageBucket: "reactshoppinglist-c2532.appspot.com",
    messagingSenderId: "343967981932",
    appId: "1:343967981932:web:4b9461063b23b328ea9349",
    measurementId: "G-ZSR9X4Q0MV"
  };


  const app = initializeApp(firebaseConfig);

  export const db = getFirestore(app);