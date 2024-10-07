const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const frontend_url = process.env.FRONTEND_URL;

//List of stores
const stores = require("./stores")

const app = express();

const corsOption = {
    origin: frontend_url,
};

app.use(cors(corsOption));

app.get("/api/stores",(req,res)=>{
    res.json(stores);
})

//Homepage
app.get("/", (req,res)=>{
    res.send("<h1>Welcom to API for Store Delivery Zone Checker");
});

app.listen(PORT, ()=>{
    console.log("Server running on port http://localhost:" + PORT);
});