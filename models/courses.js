const { model, Schema } = require("mongoose");
const { ObjectId } = Schema.Types

const course = new Schema({
    name: String,
    authorId: {
        type: ObjectId,
        ref: "User"
    },
    price: {
        type: Number,
        default: 0
    },
    courseImg: String,
    courseLogo:{
        type:String,
        required:true
    },
    courseUsersInfo: [{
        purchasedDate:{
            type:Date,
            default:Date.now()
        },
        userId:{
            type:ObjectId,
            ref:"User"
        },
        paid:Number
    }],
    courseRating: [{
    ratings:{
        type:Number,
        default:0
    },
    userId:{
        type:ObjectId,
        ref:"User"
    }
    }],
    description: String,
    catigory:{
        type:String,
        required:true,
        ref:"Catigorys"
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
      },
}, {
    timestamps: true,
})

model("Course", course)