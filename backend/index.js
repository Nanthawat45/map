const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const MAPP = require("./routers/Map");
const authRouter = require("./routers/auth.routers");
const db = require("./models/");
const role = db.Role;
const cors = require("cors");
//const F2URL = process.env.F2URL_P;
//...
// List of stores
const stores = require("./stores");

// const corsOption = {
//     origin: F2UR,
// };
const corsOption = {
    origin: "https://map-nu-beige.vercel.app/",
};
// use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dev mode
// db.sequelize.sync({force: true}).then(() =>{
//     initRole();
//     console.log("Drop and Sync DB")
// })

const initRole = () => {
    role.create({ id: 1, name: "user" });
    role.create({ id: 2, name: "moderator" });
    role.create({ id: 3, name: "admin" });
}

// ใช้งาน CORS โดยไม่ใช้ corsOptions
app.use(cors(corsOption)); // ใช้งาน CORS โดยไม่มีตัวเลือก

// use router
app.use("/api/v1/maps", MAPP);
app.use("/api/v1/auth", authRouter);

app.get("/api/stores", (req, res) => {
    res.json(stores);
});

// Homepage
app.get("/", (req, res) => {
    res.send("<h1>Welcome to API for Store Delivery Zone Checker</h1>");
});

app.listen(PORT, () => {
    console.log("Server running on port http://localhost:" + PORT);
});
