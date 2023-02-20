const { model, Schema } = require("mongoose");
const { ObjectId } = Schema.Types

const courseComment = new Schema({
    courseId: {
        type: ObjectId,
        ref: "Course"
    },
    name: String,
    description: String,
    userId: {
        type: ObjectId,
        ref: "User"
    }

}, {
    timestamps: true,
})

model("CourseComment", courseComment)