import express from 'express';
import db from "../database.js";
import { getCountFromServer, Timestamp } from 'firebase/firestore';
const app                   = express();

// Exchange Rewards
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

// Use (Redeem) owned reward in a transaction
app.post("/redeem", async(req, res) => {
    const data = req.body;
    const returnVal = await redeemRewards(data.username, data.rewardFirestoreDoc);
    res.send(returnVal);
});

// Retrieve Single Reward
app.get("/retrieve/:rewardId", async(req, res) => {
    const rewardId = req.params.rewardId;
    const reward = await retrieveReward(rewardId);

    res.send(reward);
});

// Retrieve All Rewards
app.get("/retrieveAll", async(req, res) => {
    const rewards = await retrieveAllRewards();

    res.send(rewards);
});

// Retrieve User's Rewards
app.get("/retrieveUsers/:username", async(req, res) => {
    const username = req.params.username;
    const rewards = await retrieveUserRewards(username);

    res.send(rewards);
});
// exchangeReward used to process the incoming request from FE and will act as a mediator that will do all functional calls
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

// redeemRewards used to process the incoming request from FE and will act as a mediator that will do all functional calls
async function redeemRewards(username, rewardId) {
    const redeemedReward = await useReward(username, rewardId)

    return redeemedReward;
}

// generateUniqueFirestoreId to generate random UUID
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

// useReward to use (update) user's reward with username and firestoreId as the identifier. This flows is under the assumption that there is only the happy path
// where the reward has not been redeemed and the deadline hasn't been passed.
async function useReward(username, firestoreId) {
    const rewardData = await db.collection("Users").doc(username).collection("Rewards").doc(firestoreId).get();
    const reward = rewardData.data();
    reward.redeemed = true;

    const firebaseReward = toFirebaseReward(reward);

    await db.collection("Users").doc(username).collection("Rewards").doc(firestoreId).set(firebaseReward);

    return firebaseReward;
}

// retrieveAllRewards to retrieve all rewards from the database
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

// retrieveAllRewards to retrieve all rewards from the database
async function retrieveUserRewards(username) {
    const rewardsData = await db.collection("Users").doc(username).collection("Rewards").get();
    const rewards = [];

    rewardsData.forEach(doc => {
        rewards.push({
            firestoreDoc : doc.id,
            reward : doc.data()
        });
    });
    
    return rewards;
}

// retrieveReward to retrieve a reward using the reward id from the database
async function retrieveReward(rewardId) {
    const rewardData = await db.collection("Rewards").doc(rewardId).get();
    const reward = rewardData.data();
    
    return {
        firestoreDoc : rewardData.id,
        reward : reward
    };
}

// addRewardsToUser updates user's reward collection when they exchanged their tokens
async function addRewardsToUser(username, rewardID, reward) {
    const RewardCollection = db.collection("Users").doc(username).collection("Rewards").doc(generateUniqueFirestoreId());

    await RewardCollection.set(reward);
}

// retrieveUser to retrieve a user using his/her username as identifier from the database
async function retrieveUser(username) {
    const userData = await db.collection("Users").doc(username).get();
    const user = userData.data();
    
    return user;
}

// updateUser to update an user's  details using his/her username as identifier
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
        picture : reward.picture,
    }
}

function toFirebaseReward(reward) {
    return {
        firestoreDoc : reward.firestoreDoc,
        amount : reward.amount,
        details : reward.details,
        id : reward.id,
        name : reward.name,
        purchased : new Date(reward.purchased.seconds * 1000 + reward.purchased.nanoseconds / 1000000),
        tokensNeeded : reward.tokensNeeded,
        validUntil : new Date(reward.validUntil.seconds * 1000 + reward.validUntil.nanoseconds / 1000000),
        vendor : reward.vendor,
        redeemed : reward.redeemed,
        picture : reward.picture,
    }
}

export default app;