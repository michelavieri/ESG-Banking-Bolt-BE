const express               = require('express')
const cors                  = require('cors')
const User                  = require('./config')
const session               = require("express-session");       //To store the user.
// const passport              = require("passport");              //As a part of the Authentication feature in our web.

//requiring routes
const indexApis         = require("./apis/index");
const paymentApis       = require("./apis/payment");
const tokenApis         = require("./apis/token");
const companyApis       = require("./apis/company");


const app = express()

app.use(express.json())
app.use(cors())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.post("/pay", async(req,res) => {
    const data = req.body
    await User.add(data)
    res.send({msg : "Payment Received"})
})

app.listen(4000, ()=> console.log("Up & Running 4000"))

//======================================================================================================================
//                                                  ROUTING  
//======================================================================================================================
app.use("/", indexApis);
app.use("/payment", paymentApis);
app.use("/rewards", tokenApis);
app.use("/company", companyApis);