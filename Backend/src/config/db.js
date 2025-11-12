require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "web_tech"
});

db.connect((err)=>{
    if(err){
        console.log("Database Connection Error : ", err);
        return;
    }
    console.log("Database is Connected..");
});

module.exports = db;