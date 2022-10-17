const db        = require("./database")
const User      = db.collection("Users");

module.exports  = User;