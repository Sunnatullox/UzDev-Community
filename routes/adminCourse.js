const { Router } = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Course = mongoose.model("Course");
const User = mongoose.model("User");
const Auth = require("../middleware/Auth");
const router = Router();
const firebaseDeployFile = require("../firebaseDeployFile");

router.post("/admin/courseCreate", Auth, async (req, res) => {
  const { name, authorId, catigory, price, description } = req.body;
  if (req.user.userAdmin === false) {
    return res.status(422).json("Kechirasiz siz admin emassiz!");
  }
  const courseImg = req.files?.courseImg;
  const logo = req.files?.courseLogo;
  if (!name || !authorId || !price) {
    return res.status(402).json({
      error: "darslarni yuklashda name, price, courseImg larni yuklash lozim",
    });
  }
  const fileurl = firebaseDeployFile(courseImg);
  const courseLogo = firebaseDeployFile(logo);

  try {
    const user = await User.findById({ _id: authorId });

    // user adminniligini tekshirish
    if (user?.userAdmin === true) {
      const course = new Course({
        name,
        price,
        authorId,
        courseImg: fileurl,
        courseLogo: courseLogo,
        catigory,
        description,
      });
      const savedCours = await course.save();
      return res.status(200).json(savedCours);
    } else if (user.userAdmin === false) {
      return res.status(401).json({
        msg: "kechirasiz siz Admin emassiz sizga Kurs yuklash mumkinemas!",
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

router.put("/admin/courseUpdate/:id", Auth, async (req, res) => {
  const { name, price, description, isActive } = req.body;
  const { id } = req.params;
  if (req.user.userAdmin === false) {
    return res.status(422).json("Kechirasiz siz admin emassiz!");
  }

  const courseImg = req.files?.courseImg;
  const logo = req.files?.courseLogo;
  const fileurl = firebaseDeployFile(courseImg);
  const courseLogo = firebaseDeployFile(logo);
  try {
    const updateCours = await Course.findById({ _id: id });
      updateCours.name = name ? name : updateCours.name;
      updateCours.price = price ? price : updateCours.price;
      updateCours.courseImg = fileurl ? fileurl : updateCours.courseImg;
      updateCours.courseLogo = courseLogo ? courseLogo : updateCours.courseLogo;
      updateCours.description = description ? description : updateCours.description;
      updateCours.isActive = isActive ? isActive : updateCours.isActive;
      await updateCours.save()

    return res.status(200).json(updateCours);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

router.delete("/admin/courseDelete/:id", Auth, async (req, res) => {
  const { id } = req.params;
  if (req.user.userAdmin === false) {
    return res.status(422).json("Kechirasiz siz admin emassiz!");
  }
  try {
    await Course.findByIdAndDelete({ _id: id });
    return res.status(200).json({ msg: "kurs muvafaqiyatli o'chirildi" });
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

module.exports = router;
