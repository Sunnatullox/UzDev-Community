const {Schema, model} = require("mongoose")
const {ObjectId} = Schema.Types

const postSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    tags:[{
        type:String,
        required:true
    }],
    photo:{
        type: String
    },
    postedBy:{
        type:ObjectId,
        ref:"User"
    },
    commentId:[{
        type:ObjectId,
        ref:"User"
    }],
    postTrue:[{
        type:ObjectId,
        ref:"User",
    }],
    counter:{
        type:Number,
        default:0
    }

},
{
    timestamps: true,
})



model("Post", postSchema)