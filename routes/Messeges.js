const Router = require("express");
const router = Router();
const mongoose = require("mongoose");
const login = require("../middleware/login");
const { ObjectId } = require('mongodb');
const GroupMesseges = mongoose.model("GroupMesseges");




router.post("/messeg", login, async (req, res) => {

  const {text,groupId}= req.body
  if(text || groupId){
    const newMesseg = new GroupMesseges({
      sender:req.user._id,
      text,
      convertatsionId:groupId,
      senderName:req.user.name,
      senderPhoto:req.user.userPhoto
    });
    try {
      const messeg = await newMesseg.save();
      res.json(messeg);
    } catch (err) {
      res.status(422).json({ error: "The message was not sent" });
      console.log(err);
    }
  }
});




router.get("/gruop/messeges/:id", login, async (req, res) => {
  const {messeges} = req.body
  try {
    const messeges = await GroupMesseges.find({
      convertatsionId: req.user.id,
    });
    res.json(messeges)
  } catch (err) {
    res.status(422).json({ error: "No message found" });
    console.log(err);
  }
});

module.exports = router;
