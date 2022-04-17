const {Schema, model} = require("mongoose")
const {ObjectId} = Schema.Types

const commentsSchema = new Schema({
    text:{
        type:String,
        required:true
    },
    code:String,
    postId:{
        type:ObjectId,
        ref:"User"
    },
    commentLike:[{
        type:ObjectId,
        ref:"User",
    }],
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
},
{
    timestamps: true,
}
)

model("Comments", commentsSchema)
