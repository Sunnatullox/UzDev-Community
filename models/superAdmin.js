const { model, Schema } = require("mongoose");

const superAdminSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    userAdmin:{
        type:Boolean,
        default:true
    },
    password:{
        type:String,
        required:true
    },
    secretInfo:{
        type:String,
        required:true
    },
    adminAvatar:String
},{
    timestamps: true,
})

model("SuperAdmin", superAdminSchema)