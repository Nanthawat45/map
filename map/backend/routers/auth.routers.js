const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifySignUp} = require("../middleware");

router.use((req, res, next) =>{
    res.header(
      "Access-Control-Allow-Headers",
      "x-acces-token, origin, Content-Type, Accept"
    );
    next();
});
router.post(
    "/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    authController.signup
);
//create a restaurant
//POST http://localhost:5000/api/v1/auth/signup
//POST http://localhost:5000/api/v1/auth/signin
// router.post("/signup", authRouter.signup);
router.post("/signin", authController.signin);

module.exports = router;