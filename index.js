require("dotenv").config()
const cluster = require("cluster")
const express = require("express");
const app = express();
const path = require("path")
const cors = require("cors")
const mongoose = require("mongoose")
const compression = require("compression")
const fileUpload = require("express-fileupload")
const  errorHandler = require("./middleware/Errors.js")
const  notFoundHandler = require("./middleware/notFounHandler.js")
const DB_MONGODB_URL = process.env.DB_MONGODB_URL

const swaggerUI = require("swagger-ui-express");
const Yaml = require("yamljs")
const SwaggerDoc = Yaml.load("./documentation/api.yaml")
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(SwaggerDoc))
mongoose.connect(DB_MONGODB_URL, () => console.log("mongodb connected sucessfuly"));

let PORT = process.env.PORT || 5000
    require('./models/users')
    require('./models/superAdmin')
    require('./models/courses')
    require('./models/courseLesson')
    require('./models/courseComment')
    require('./models/courseBooks')
    require('./models/catigoryModel')
    
    app.use(compression())
    app.use(fileUpload())
    
    app.use(cors({
        origin:"*"
    }));
    app.use(express.json())
    app.use(express.static(path.resolve(__dirname, "CourseFile")))
    app.use(require('./routes/auth'))
    app.use(require('./routes/superAdmin'))
    app.use(require('./routes/adminCourse'))
    app.use(require('./routes/courseLesson'))
    app.use(require('./routes/courseComment'))
    app.use(require('./routes/userStudend'))
    
    
    // error handlera
    app.use(errorHandler)
    app.use(notFoundHandler)


app.listen(PORT, () => {
    console.log("SERVER ON PORT LISTEN " + PORT)
})