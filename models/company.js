import { getDatabase } from "firebase/database"

const firebase      = require("./database")
const db            = getDatabase();
const Company       = db.collection("Companies");

module.exports      = Company;