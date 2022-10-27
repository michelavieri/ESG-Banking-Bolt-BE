import express, { json } from 'express';
import cors from 'cors';
import session from 'express-session';       //To store the user.
import db from "./src//database.js";
import { ref,set } from "firebase/database";
// const passport              = require("passport");              //As a part of the Authentication feature in our web.

//requiring routes
// import indexApis from "./src/apis/index";
import paymentApis from "./src/apis/payment.js";
import rewardApis from "./src/apis/rewards.js";
// const companyApis       = require("./apis/company");



const app = express()

app.use(json())
app.use(cors())
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }))

app.listen(4000, ()=> console.log("Up & Running 4000"))

//======================================================================================================================
//                                                  ROUTING  
//======================================================================================================================
// app.use("/", indexApis);
app.use("/payment", paymentApis);
app.use("/rewards", rewardApis);
// app.use("/company", companyApis);
app.post("/user", async(req, res) => {
    const data = req.body
    const User = db.collection("Users").doc(data.username)
    // const reference = ref(db, 'user/' + data.username);

    // set(reference, req);
    await User.set(data);
    res.send({msg : "User has been added"});
})