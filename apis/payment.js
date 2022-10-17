import { onValue } from "firebase/database"

const express               = require("express");
const app                   = express();
const db                    = require("../models/database")

// Payment Route
app.post("/payment/pay", async(req, res) => {
    writePaymentData(req.userID, req.transaction);
    res.send({msg : "Payment has been received"});
})

// Logout Route
app.post("/logout", async(req, res) => {

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
    onValue(reference, (snapshot) => {
        const data          = snapshot.val();
        var currBalance     = data.balance;
        var newBalance      = currBalance + calculateGreenToken(transactionAmount);

        db.ref(reference + "/balance").set(newBalance);
    })
}

module.exports = app;