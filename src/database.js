import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig    = {
    apiKey: "AIzaSyDzyNDfpHJmFxRxAgs4JSB07U6reIFMBZM",
    authDomain: "esg-banking-bolt.firebaseapp.com",
    projectId: "esg-banking-bolt",
    storageBucket: "esg-banking-bolt.appspot.com",
    messagingSenderId: "547643789674",
    appId: "1:547643789674:web:372f37ef2e8a6ca4285513",
    measurementId: "G-T2CRLGZ2T8"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export default db;