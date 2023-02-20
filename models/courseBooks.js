const { model, Schema } = require("mongoose");
const { ObjectId } = Schema.Types
const courseBoks = new Schema({
    courseId: {
        type: ObjectId,
        ref: "Course"
    },
    name:String,
    bookFile:String,
    urlBooks:String,
    completedBook:[{
        type:ObjectId,
        ref:"User"
    }],
    description:String

},{
    timestamps:true
})

model("Books", courseBoks)