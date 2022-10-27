import express from 'express';
import db from "../database.js";
import { ref, onValue, update } from "firebase/database";
import { Timestamp } from 'firebase/firestore';
const app                   = express();

// Payment Route
app.post("/pay", async(req, res) => {
    const data = req.body;
    writePaymentData(data.username, data.transaction);
    res.send({msg : "Payment has been received"});
});

app.get("/pay/:companyName", async(req, res) => {
    const companyName = req.params.companyName;
    const companyDetails = await getCompanyDetails(companyName);

    res.send(companyDetails);
});

app.post("/calculateToken", async(req, res) => {
    const data = req.body;
    const token = calculateGreenToken(data.amount, data.donation);
    res.send({token : token});
});

function generateUniqueFirestoreId(){
    // Alphanumeric characters
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    return autoId;
  }

async function writePaymentData(username, payment) {

    //If reward is included
    if (payment.rewardUsed == null || payment.rewardUsed == undefined) {
        //Update the reward status here
    }

    //Add code to generate greenToken
    const tokenEarned = await addGreenToken(username, payment.amount, payment.donation)
    payment.timestamp = Timestamp.now();
    Promise.resolve(tokenEarned).then((value) => payment.tokensEarned += value);
    await addTransaction(username, payment);
}

function updateRewardStatus(username, rewardID){

}

function calculateGreenToken(amount, donation) {
    return (0.10 * amount) + donation;
}

async function addTransaction(username, payment) {
    const userData = await db.collection("Users").doc(username).get();
    const user = userData.data();
    
    user.Transactions.push(payment);
    await db.collection("Users").doc(username).set(user);
}

async function addGreenToken(username, transactionAmount, donation) {
    const userData = await db.collection("Users").doc(username).get();
    const user = userData.data();

    const tokenEarned = calculateGreenToken(transactionAmount, donation);
    user.GreenProfile.balance += tokenEarned;

    await db.collection("Users").doc(username).set(user);

    return tokenEarned;
}

async function getCompanyDetails(companyName) {
    const companyData = await db.collection("Companies").doc(companyName).get();
    const company = companyData.data();
    
    return company;
}

export default app;