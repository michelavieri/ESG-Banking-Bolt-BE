import express from 'express';
import db from "../database.js";
const app                   = express();

// Payment Route
app.post("/payment/pay", async(req, res) => {
    writePaymentData(req.userID, req.transaction);
    res.send({msg : "Payment has been received"});
})

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

function writePaymentData(userID, payment) {
    // const transactionID = generateUniqueFirestoreId()
    // const reference = ref(db, "users/" + userID + "/transactions/" + transactionID)
    db.ref('users/' + userID + '/transactions').push(payment)

    //If reward is included
    if (payment.rewardUsed == null || payment.rewardUsed == undefined) {
        //Update the reward status here
    }

    //Add code to generate greenToken
    addGreenToken(userID, payment.amount)
}

function updateRewardStatus(userID, rewardID){

}

function calculateGreenToken(amount) {
    return 0.10 * amount;
}

function addGreenToken(userID, transactionAmount) {
    const reference = ref(db, "/users/" + userID + "/green_profile")
    db.onValue(reference, (snapshot) => {
        const data          = snapshot.val();
        var currBalance     = data.balance;
        var newBalance      = currBalance + calculateGreenToken(transactionAmount);

        db.ref(reference + "/balance").set(newBalance);
    })
}

export default app;