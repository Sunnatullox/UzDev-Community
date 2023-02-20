require("dotenv").config()
const jwt = require("jsonwebtoken");
const  mongoose  = require("mongoose");
const JWT_SECRET   = process.env.JWT_SECRET;
const User = mongoose.model("User");
const superAdmin = mongoose.model("SuperAdmin")
module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization ) {
        res.status(409).json({error:"Iltimos avval ro'yhatdan o'ting"})
    }

    const token = authorization.replace("Bearer ","")
    jwt.verify(token, JWT_SECRET, (error, payload) => {
        if(error){
            return(
                res.status(409).json({msg:"Iltimos avval ro'yhatdan o'ting"})
            )
        }
        try {
            const {_id} = payload
            const userData = User.findById(_id)
            if(userData){
                req.user = userData
                next();
            }else{
                const superAdminn = superAdmin.findById(_id)
                req.user = superAdminn
                next();

            }
        } catch (error) {
            res.status(500).json({msg:"Sizga ruhsat berilmad qayta urinib ko'ring"})
        }

    })

}
