const {Schema, model} = require("mongoose")
const {ObjectId} = Schema.Types


const GroupsSchema = new Schema({
    users:[{
        type:String
    }],
    creators:{
        type:String
    },
    groupName:{
        type:String,
        required:true
    },
    groupPhoto:{
        type:String
    }
},
{
    timestamps: true,
})

model("Group", GroupsSchema)