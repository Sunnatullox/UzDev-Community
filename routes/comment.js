const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");
const login = require("../middleware/login");
const Comments = mongoose.model("Comments");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const { ObjectId } = require('mongodb');




router.get("/comments/:postId", login, async(req, res) => {
    const { postId } = req.params;
   await Comments.find({"postId": new ObjectId(postId)})
    .populate("postedBy", "name _id email userPhoto specilization, telNumber")
      .then((posts) => {
        res.json({ posts });
      })
      .catch((err) => {
        console.log(err);
      });
  });




  router.post("/comments", login, async(req, res) => {
    const comment = {
      postedBy: req.user,
      text: req.body.text,
      code:req.body.code,
      postId:req.body.postCommentId
    };
    const {text} = req.body;
  if (!text) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  const comments = new Comments(comment);

  await comments.save((err, result) => {
    if(err){
      console.log(err);
      return res.status(422).json({ error: "comment not uploaded server error" });
    }
    if(result){
      Post.findByIdAndUpdate({_id: result.postId},
      {$push:{commentId: result._id}},
      {new:true})
      .exec((err, commentId) => {
        if(err) {
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate({_id: new ObjectId(result.postedBy._id)},
        {$push:{answers:result._id}},
        {new:true})
        .exec((error, answer) => {
          if(error){
            res.status(422).json(error, "No comments found Server error")
          }
          res.json({comments:result, commentId,answer})
        })
    })
    }
  })

});




  router.put("/commentLike",login, async(req,res) => {

 await Comments.findByIdAndUpdate(req.body.commentId,
    {
      $push: { commentLike: req.user._id },
    },
    { new: true })
    .populate("commentLike", "_id")
    .populate("postedBy", "name _id email specilization, telNumber")
  .exec((err, result) => {
    if(err) {
      return res.status(422).json({error:err})
    }
    
      Post.findByIdAndUpdate({_id: new ObjectId(req.body.postId)},
        {$push:{postTrue:req.body.commentId}},
        {new:true})
        .exec((err, like) => {
          if(err){
            res.status(422).json({error:"Your comment has not been uploaded"})
          }
          User.findByIdAndUpdate({_id: new ObjectId(result.postedBy._id)},
          {$inc:{answerTrue:1}},
          {new:true})
          .exec((error, answer) => {
            if(error){
              res.status(422).json(error, "No comments found Server error")
            }
            res.json({result, like, answer})
          })
        })
  })
})
  router.put("/comments/unCommentLike",login, async(req,res) => {
 await Comments.findByIdAndUpdate(
    req.body.commentId,
    {
      $pull: { commentLike: req.user._id },
    },
    { new: true })
    .populate("commentLike", " _id")
    .populate("postedBy", "name _id email specilization, telNumber")
  .exec((err, result) => {
    if(err) {
      return res.status(422).json({error:err})
    }
    
    Post.findByIdAndUpdate({_id: new ObjectId(req.body.postId)},
    {$pull:{postTrue:req.body.commentId}},
    {new:true})
    .exec((err, like) => {
      if(err){
        res.status(422).json({error:"Your comment has not been uploaded"})
      }
      User.findByIdAndUpdate({_id: new ObjectId(result.postedBy._id)},
      {$inc:{answerTrue:-1}},
      {new:true})
      .exec((error, answer) => {
        if(error){
          res.status(422).json(error, "No comments found Server error")
        }
        res.json({result, like, answer})
      })
    })
  })
})
 

router.put("/deletComment/:id", login, async function  (req, res) {

 await Comments.findByIdAndRemove(req.body.commentIds, (err, post) => {
      if (err) {
        return res.status(422).json({error:err},"Your comment has not been deleted")
        throw err
      }else{
        User.findByIdAndUpdate ({_id: new ObjectId(req.body.delUserId)},
        {$pull:{answers:req.body.commentIds}},
        {new:true})
        .exec((error, answer) => {
          if(error){
            res.status(422).json(error, "No comments found Server error")
            throw error
          }else{
            Post.findByIdAndUpdate({_id: new ObjectId(req.body.deletcomId)},
        {$pull:{postTrue: req.body.commentIds, commentId:req.body.commentIds}},
        {new:true})
        .exec((err, like) => {
          if(err){
            res.status(422).json({error:"your comment has not been deleted"})
            throw err
          }else{
            res.json({answer, post, like, msg : "you have successfully deleted your feedback"})
          }
        })
          }
        })
      }
  }).catch(err => console.log(err))
})







module.exports = router;