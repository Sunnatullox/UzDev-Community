const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    userPhoto:String,
    answerTrue:{
        type:Number,
        default:0
    },
    answers:[{
        type:String,
        ref:"User"
    }],
    telNumber:Number,
    specilization:[{
        type:String
    }]

},{
    timestamps: true,
});

model("User",userSchema)