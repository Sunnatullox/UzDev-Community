const Router = require("express");
const router = Router();
const mongoose = require("mongoose");
const login = require("../middleware/login");
const Group = mongoose.model("Group");
const GroupMesseges = mongoose.model("GroupMesseges");
const { ObjectId } = require("mongodb");
const User = mongoose.model("User");

router.post("/groupCreait", login, async (req, res) => {
  const { groupName, groupPhoto, serderId, receveredId } = req.body;
  const user = [req.user?._id];
  if (!groupName && groupPhoto) {
    res.status(422).json({ error: "Please enter your group name and picture" });
  }
  const group = await new Group({
    groupName,
    groupPhoto,
    creators: req.user._id,
    users: user,
  });
  try {
    group
      .save()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    res.status(422).json({ error: "Group was not created" });
    console.log(err);
  }
});

router.get("/group/myGroup/:convertatsionId", login, async (req, res) => {
  try {
    await Group.find({ _id: req.params.convertatsionId }).then(
      async (result) => {
        await GroupMesseges.find({
          convertatsionId: req.params.convertatsionId,
        }).then((mess) => {
          /*  console.log(result); */
          const newArr = [];
          result.map((i) =>
            i.users.map((b) => {
              return newArr.push(b);
            })
          );
          User.find({ _id: newArr.map((i) => i) }).then((us) => {
            res.status(200).json({ group: result, messeg: mess, groupUs: us });
          });
        });
      }
    );
  } catch (err) {
    res.status(422).json({ error: "No such group found" });
    console.log(err);
  }
});

router.get("/AllGroups", login, (req, res) => {
  Group.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/memberUser", login, (req, res) => {
  try {
     Group.findByIdAndUpdate(
      { _id: req.body.convertatsionId },
      { $push: { users: req.body.userId } },
      { new: true })
      .exec((err, result) => {
        if(err){
          return res.status(422).json({error:"User Groupga qo'shilmadi"})
        }
        res.json(result)
      })
  } catch (err) {
    res
      .status(422)
      .json({ error: "Could not join group or group not found" });
    console.log(err);
    return;
  }
});

router.put("/quitUserGroup", login, async(req, res) => {
  console.log(req.body.convertatsionId, req.body.userId)
      try{
        Group.findByIdAndUpdate({_id:req.body.convertatsionId},
          {$pull:{users:req.user?._id}},
          {new:true}).exec((err, result) => {
            if(err){
            return res.status(422).json({error:"Could not leave group"})
            }
            res.json(result)
          })
      }catch(err){
        console.log(err);
      }
})

router.post("/deletGroup", login, async(req, res) => {
  console.log(req.body.GroupId)
    try{
     await Group.findByIdAndRemove(req.body.GroupId,(err, result) => {
      if(err){
        console.log(err);
        return res.status(422).json({error:"The group could not be deleted"})
      }
      res.json(result)
    })
    }catch(err){
      console.log(err);
    }
})

router.put("/updateGroupImg", login, async(req,res)=> {
  try{
   await Group.findByIdAndUpdate({_id:req.body.groupId},
     {$set:{groupPhoto:req.body.groupImg}},
     {new:true}).exec((err, result) => {
       if(err){
         return res.status(422).json({error:"Group Picture Not Uploaded"})
       }
       res.json(result)
     })

  }catch(err) {
    console.log(err);
  }
})

module.exports = router;
