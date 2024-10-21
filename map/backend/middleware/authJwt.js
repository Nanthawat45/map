const jwt = require("jsonwebtoken");
const config = require("../config/auth.consfig");
const db = require("../models");
const User = db.User;

//verify token
verifyToken = (req,res,next)=>{
    let token = req.headers["x-access-token"];
    if(!token){
        return res.status(403).send({
            message:"No token provided!",
        });
    }
    jwt.verify(token, config.secret,(err, decoded)=>{
        if(err){
            return res.status(401).send({
                message:"Unauthorized!", 
            });
        }
        req.userId = decoded.id;
        next();
    });
};

//isAdmin?
isAdmin = (req,res,next) =>{
    //SELECT role FROM User WHERE id = userId
    User.findByPk(req.userId).then((user)=>{ 
        user.getRoles().then(roles=>{
                for(let i = 0; i < roles.length; i++){
                  //roles[i].name เนอะไม่ใช่ .role ไปดูตัวแปรที่ตั้งในไฟล์ role.model ด้วย!
                    if(roles[i].name === "admin"){
                        next();
                        return;
                    }
                }
            res.status(401).send({ 
            message: "Require Admin Role",
         });
        });
    });
};
//isMod
isMod = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }
      res.status(401)
        .send({ message: "Unauthorized access, require Moderator Role!",

         });
    });
  });
};

//isAdminOrMod
isAdminOrMod = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      
      
      for (let i = 0; i < roles.length; i++) {
        if (
          
            roles[i].name === "moderator" || 
            roles[i].name === "admin"
        ) {
          next();
          return;
        }
      }
     res.status(401).send({ 
        message: "Unauthorized access, require Moderator OR admin Role!",
     });
    });
  });
};


const authJwt = {
    verifyToken,
    isAdmin,
    isMod,
    isAdminOrMod,
};
module.exports= authJwt;