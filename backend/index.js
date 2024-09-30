const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT;
const frontend_url = process.env.FRONTEND_URL;
const corsOption = {
    origin: frontend_url,
};

//List of stores
const stores = require("./stores")
//console.log(stores);

app.get("/api/stores",(req,res)=>{
    res.json(stores);
})

const app = express();
app.use(cors(corsOption));

//Homepage
app.get("/", (req,res)=>{
    res.send("<h1>Welcom to API for Store Delivery Zone Checker");
})

app.listen(PORT), ()=>{
    console.log();
}