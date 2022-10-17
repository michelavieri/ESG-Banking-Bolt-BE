const firebase          = require('firebase')
const firebaseConfig    = {
    apiKey: "AIzaSyDzyNDfpHJmFxRxAgs4JSB07U6reIFMBZM",
    authDomain: "esg-banking-bolt.firebaseapp.com",
    projectId: "esg-banking-bolt",
    storageBucket: "esg-banking-bolt.appspot.com",
    messagingSenderId: "547643789674",
    appId: "1:547643789674:web:372f37ef2e8a6ca4285513",
    measurementId: "G-T2CRLGZ2T8"
  };

  firebase.inititializeApp(firebaseConfig);


  const db              = firebase.firestore();
  const User            = db.collection("Users");
  const Reward          = db.collection("Rewards");
  const GreenProfile    = db.collection("GreenProfiles"); //Can remove if Firebase if non-SQL
  const Voucher         = db.collection("Voucher");
  const Company         = db.collection("Companies");


  module.exports        = User, Reward, GreenProfile, Voucher, Company;