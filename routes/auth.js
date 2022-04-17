const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/key")
const login = require("../middleware/login")


router.get("/protected", login, (req, res) => {
  res.send("Hello DEV overflow");
});

router.post("/signup", (req, res) => {
  const { name, email, password, image } = req.body;
  if (!email || !name || !password) {
    return res.status(422).json({ error: "All entries must be completed" });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "Such an email address is registered" });
      }
      bcrypt.hash(password, 10).then((hashedPass) => {
        const user = new User({
          email,
          name,
          password:hashedPass,
         userPhoto:image
        });
        user.save()
        .then((user) => {
          res.json({ msg: "You are registered"});
        })
        .catch((err) => {
          console.log(err);
        });
      });
    })
});


router.post("/signin", (req, res) =>{
  const {email, password} = req.body;
  if(!email || !password){
   return res.status(422).json({error:"Enter your email and password"})
  }
  User.findOne({email}).then(savedUser => {
    if(!savedUser){
     return res.status(422).json({error: "Your email address or password is incorrect"})
    }
    bcrypt.compare(password, savedUser.password)
    .then(doMatch =>{
      if(doMatch){
        // res.json({msg:"saccesfully signed in"})
        
        const token = jwt.sign({_id: savedUser._id},JWT_SECRET)
        const {name, _id, email,userPhoto, specilization, telNumber}=savedUser
        res.json({token:token,
           user: {_id, name, email,userPhoto, specilization, telNumber}})
      }else{
        return res.status(422).json({error : "Your email address or password is incorrect"})
      }
    })
    .catch(err => {
      console.log(err);
    })
  })
})

module.exports = router;
