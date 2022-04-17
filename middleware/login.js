const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/key")
const mongoose = require("mongoose");
const User = mongoose.model("User")

module.exports = (req, res, next) =>{
    const{ authorization } = req.headers;
    if(!authorization){
        res.status(401).json({error: "Iltimas avval ro'yhatdan o'ting"})
        res.send("/signup")
    }
    // authorization.replace ichiga yozilgan textdan keyinabzatelna probel bo'sh joy qoldirish kerak nima deb savol berilsa bu
    //  qachonkiy har registerdan o'tilayotganda jwt tokening oldida Sunna dega yozuv bo'ladi 
   const token =  authorization.replace("Sunna ", "")
    jwt.verify(token, JWT_SECRET,(err, payload) => {
        if(err){
            return (
                res.status(401).json({error:"Iltimas avval ro'yhatdan o'ting"})
                )
        }

        const {_id}= payload
        User.findById(_id)
        .then(userData => {
            req.user = userData
            next();
        })
    })
}