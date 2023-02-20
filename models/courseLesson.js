const { model, Schema } = require("mongoose");
const { ObjectId } = Schema.Types

const courseLesson = new Schema({
    courseId: {
        type: ObjectId,
        ref: "Course"
    },
    name: String,
    lessonVideo:String,
    completedLesson:[{
        type: ObjectId,
        ref:"User"
    }],
    isActive: {
        type: Boolean,
        default: true,
        required: true,
      },
    description: String
}, {
    timestamps: true,
})

model("CourseLesson", courseLesson)