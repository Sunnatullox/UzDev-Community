const { Router } = require("express");
const mongoose = require("mongoose");
const CourseComment = mongoose.model("CourseComment");
const router = Router();
const Auth = require("../middleware/Auth");

router.post("/user/courseComment/create", Auth, async (req, res) => {
  const { description, userId, name, courseId } = req.body;

  try {
    const createComment = new CourseComment({
      courseId,
      name,
      description,
      userId,
    });
    const comment = await createComment.save();

    return res.status(200).json(comment);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

router.put("/user/courseComment/update/:id", Auth, async (req, res) => {
  const { id } = req.params;
  const { description, name } = req.body;

  try {
    const updateComment = await CourseComment.findById({ _id: id });
    updateComment.name = name ? name : updateComment.name;
    updateComment.description = description
      ? description
      : updateComment.description;

    const updatedComment = await updateComment.save();
    return res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});
router.delete("/user/courseComment/delete/:id", Auth, async (req, res) => {
  const { id } = req.params;
  try {
    const updateComment = await CourseComment.findByIdAndDelete({ _id: id });
    return res.status(200).json(updateComment);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

module.exports = router;
