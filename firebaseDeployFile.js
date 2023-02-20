const uuid = require("uuid");
const { busket } = require("./firebase");

const firebaseDeployFile = (file) => {
    let url= null
   if(file) {
       let storageRef = uuid.v4() + file?.name;
       const upload = busket.file(storageRef);
   
       const stream = upload.createWriteStream({
         metedata: {
           contentType: file.mimetype,
         },
       });
   
       stream.on("error", (e) => {
         console.log(e);
       });
   
       stream.on("finish", async () => {
         await upload.makePublic();
       });
       stream.end(file.data);
       
       url = `https://storage.googleapis.com/${process.env.DATABASE_URL}/${storageRef}`;
   }
    return url
    }

module.exports = firebaseDeployFile