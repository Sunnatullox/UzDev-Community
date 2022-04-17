const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");
const login = require("../middleware/login");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const { ObjectId } = require('mongodb');
const bcrypt = require("bcryptjs");


router.get("/AllUser", login, (req, res) => {
    User.find()
    .then((result) =>{
        res.json(result)
    }).catch(error => {
        console.log(error);
    })
})

router.get("/profile/:id", login, async(req, res) => {
   await User.findById({_id: req.params.id})
    .select("-password")
    .then((user) => {
        Post.find({postedBy: req.params.id})
        .populate("postedBy", "_id name userPhoto specilization, telNumber")
/*         .getFilter(postTrue, ["name", "email", "_id"]) */
        .exec((err, result) => {
            if(err) {
                return res.status(422).json({error:err})
            }
            res.json({ user, result })
        })
    }).catch(err => {
        return res.status(404).json( err,{error:"user not found"})
    })

})


router.put("/userPhotoUpload",login, async(req, res) => {
    const {image, userId} = req.body
    if(!image && !userId){
        res.status(422).json({error:"user or image not found"})
    }else if(image && userId){
        try{
        await User.findByIdAndUpdate({_id :new ObjectId (userId)},
                { $set: {userPhoto:image} },
                { new: true },(err, result) => {
                    if(err){
                       return res.status(422).json({error:"User image not loaded"})
                    }
                    res.json(result)
                })
            }catch(err){
                console.log(err);
            }
            return
        }
  })



router.put("/userEditProfile", login,(req, res)=>{
    const {name, email, password, telNumber,specilization, editUserId}=req.body
    if(!name&& !email && !password && !telNumber && !specilization && !editUserId){
        return res.status(422).json({error:"Please fill in all inputs"})
    }
    if(name&& email && password && telNumber && specilization && editUserId){
        try{
            bcrypt.hash(password,10).then(pass => {
                 User.findByIdAndUpdate({_id:editUserId},
                     {$set:{name, email, password:pass,telNumber, specilization }},
                     {new:true}, function(err, result){
                         if(err){
                             res.status(422).json({error:"Please fill in all inputs"})
                         }
                         res.json(result)
                     })
            })
        }catch(err){
            console.log(err);
        }
        return;
    }
})

router.get("/userInfo", login, async(req, res) => {
   await User.findOne({_id : new ObjectId(req.user._id)})
    .select("-password")
    .exec((err, result)=>{
        if(err){
            res.status(422).json({error:"user data not found"})
        }
        res.json(result)
    })
})


module.exports = router;