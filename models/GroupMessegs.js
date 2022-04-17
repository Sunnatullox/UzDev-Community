const {Schema, model} = require("mongoose")
const {ObjectId} = Schema.Types


const GroupMessegesSchema = new Schema({
 convertatsionId:{
     type:String,
 },
 sender:{
     type:String
 },
 senderName:{
     type:String,
 },
 senderPhoto:{
     type:String
    },
 text:{
     type:String
 }
},
{
    timestamps: true,
})

model("GroupMesseges", GroupMessegesSchema)