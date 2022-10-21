import express, { json } from 'express';
import cors from 'cors';
import session from 'express-session';       //To store the user.
// const passport              = require("passport");              //As a part of the Authentication feature in our web.

//requiring routes
// import indexApis from "./src/apis/index";
import paymentApis from "./src/apis/payment.js";
// const tokenApis         = require("./apis/token");
// const companyApis       = require("./apis/company");



const app = express()

app.use(json())
app.use(cors())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.listen(4000, ()=> console.log("Up & Running 4000"))

//======================================================================================================================
//                                                  ROUTING  
//======================================================================================================================
// app.use("/", indexApis);
app.use("/payment", paymentApis);
// app.use("/rewards", tokenApis);
// app.use("/company", companyApis);