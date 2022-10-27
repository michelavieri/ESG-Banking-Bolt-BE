import express from 'express';
import db from "../database.js";
import { getCountFromServer, Timestamp } from 'firebase/firestore';
const app                   = express();

// Payment Route
app.post("/exchange", async(req, res) => {
    const data = req.body;
    try {
        const returnVal = await exchangeReward(data.username, data.reward);
        res.send(returnVal);
    } catch(e) {
        res.status(500);
        res.send(e.message);
    }
});

app.get("/retrieve/:rewardId", async(req, res) => {
    const rewardId = req.params.rewardId;
    const reward = await retrieveReward(rewardId);

    res.send(reward);
});

app.get("/retrieveAll", async(req, res) => {
    const rewards = await retrieveAllRewards();

    res.send(rewards);
});

async function exchangeReward(username, reward) {
    const user = await retrieveUser(username);
    const ownedToken = user.GreenProfile.balance;

    if (ownedToken < reward.reward.tokensNeeded) {
        throw new Error('Insufficient Token!');
    }

    user.GreenProfile.balance -= reward.reward.tokensNeeded;
    await updateUser(username, user);

    const convertedReward = convertReward(reward.firestoreDoc, reward.reward);
    await addRewardsToUser(username, reward.firestoreDoc, convertedReward);

    return convertedReward;
}

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

async function retrieveAllRewards() {
    const rewardsData = await db.collection("Rewards").get();
    const rewards = [];

    rewardsData.forEach(doc => {
        rewards.push({
            firestoreDoc : doc.id,
            reward : doc.data()
        });
    });
    
    return rewards;
}

async function retrieveReward(rewardId) {
    const rewardData = await db.collection("Rewards").doc(rewardId).get();
    const reward = rewardData.data();
    
    return {
        firestoreDoc : rewardData.id,
        reward : reward
    };
}

async function addRewardsToUser(username, rewardID, reward) {
    const RewardCollection = db.collection("Users").doc(username).collection("Rewards").doc(generateUniqueFirestoreId());

    await RewardCollection.set(reward);
}

async function retrieveUser(username) {
    const userData = await db.collection("Users").doc(username).get();
    const user = userData.data();
    
    return user;
}

async function updateUser(username, user) {
    await db.collection("Users").doc(username).set(user);
}

function convertReward(rewardID, reward) {
    return {
        firestoreDoc : rewardID,
        amount : reward.amount,
        details : reward.details,
        id : reward.id,
        name : reward.name,
        purchased : new Date(),
        tokensNeeded : reward.tokensNeeded,
        validUntil : new Date(reward.validUntil.seconds * 1000 + reward.validUntil.nanoseconds / 1000000),
        vendor : reward.vendor,
        redeemed : false,
    }
}

export default app;