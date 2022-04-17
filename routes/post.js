const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");
const login = require("../middleware/login");
const Post = mongoose.model("Post");

router.get("/allpost", login, (req, res) => {
  Post.find()
    .populate("postedBy", "name _id email userPhoto")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});









router.get(`/post/:postId`, login, async(req, res) => {
  const { postId } = req.params;
 await Post.findById({_id: postId})
  .populate("postedBy", "name _id email userPhoto")
    .then((posts) => {
      res.json({posts})
    })
    .catch((err) => {
      console.log(err);
    });
try{ await Post.findByIdAndUpdate({_id:postId},
     {$inc:{counter:1}},
     {new:true})
  }catch(err){
    console.log(err);
  }
});









router.post("/createpost", login, async(req, res) => {
  const { title, body, pict, tags } = req.body;
  if (!title || !body || !tags ) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  console.log(title, body, tags)
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pict,
    postedBy: req.user,
    tags
  });
await post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", login, async(req, res) => {
 await Post.find({ postedBy: req.user._id })
    .populate("postedBy", "name _id email userPhoto")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.get("/deletePost/:postId", login, async function(req, res) {
 await Post.findByIdAndRemove(req.params.postId, (err, post) => {
      if (!err || post) {
        res.json({msg : "You have successfully deleted the post"})
      } else {
        console.log(err);
        return res.status(422).json({error:err})
      }
  }).catch(err => console.log(err))
})



module.exports = router;
