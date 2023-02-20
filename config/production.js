require("dotenv").config()

module.exports={
    DB_MONGODB_URL:process.env.DB_MONGODB_URL,
    JWT_SECRET:process.env.JWT_SECRET
}