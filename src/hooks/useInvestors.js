import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  query,
  writeBatch,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { useState } from "react";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT,
  storageBucket: process.env.REACT_APP_STORAGE,
  messagingSenderId: process.env.REACT_APP_MESSAGING_ID,
  appId: process.env.REACT_APP_APP_ID,
};

export async function updateInvestor(address, data) {
  const app = initializeApp(firebaseConfig);
  try {
    const db = getFirestore(app);
    if (db) {
      const pairRef = doc(db, "investors", address);
      await setDoc(pairRef, {
        ...data,
      });
    }
  } catch (e) {
    console.error(e);
  }
}

export function useGetInvestors() {
  const [investors, setInvestors] = useState(null);

  async function loadInvestors() {
    const app = initializeApp(firebaseConfig);
    try {
      const db = getFirestore(app);
      const pairsRef = collection(db, "investors");
      const q = query(pairsRef, orderBy("totalRaisedInGasToken", "desc"));
      const pairsSnapshot = await getDocs(q);
      let tmpArray = [];
      pairsSnapshot.forEach((investor) => {
        tmpArray.push({
          ...investor.data(),
          address: investor.id,
        });
      });
      setInvestors(tmpArray);
    } catch (e) {
      console.error(e);
    }
  }

  if (!investors) {
    loadInvestors();
  }
  return investors;
}
