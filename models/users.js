const { model, Schema } = require("mongoose");
const { ObjectId } = Schema.Types
const userSchema = new Schema({
    name:String,
    email:String,
    password:String,
    userAvatar:String,
    userCourseId:[{
        type:ObjectId,
        ref:"Course"
    }],
    userAdmin:{
        type:Boolean,
        default:false
    }

},{
    timestamps: true,
})

model("User", userSchema)