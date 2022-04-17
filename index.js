const express= require("express");
const app = express();
const PORT = process.env.PORT|| 5000
const path = require("path")
const cors = require("cors")
const mongose = require("mongoose");
const {MONGO_URL} = require("./config/key")
mongose.connect(MONGO_URL);


require("./models/users");
require("./models/post");
require("./models/comments");
require("./models/group");
require("./models/GroupMessegs");
app.use(cors())
app.use(express.json())
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/comment"));
app.use(require("./routes/User"));
app.use(require("./routes/group"));
app.use(require("./routes/Messeges"));

if(process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname,"client", "build","index.html" ))
    })
}

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}`);
})
