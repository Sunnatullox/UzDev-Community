const { Router } = require("express");
const mongoose = require("mongoose");
const CourseLesson = mongoose.model("CourseLesson");
const User = mongoose.model("User");
const CourseBooks = mongoose.model("Books");
const Auth = require("../middleware/Auth");
const router = Router();
const firebaseDeployFile = require("../firebaseDeployFile");

router.post("/admin/lessson/create", Auth, async (req, res) => {
  const { name, description, courseId, adminId } = req.body;
  if (!adminId) {
    return res.status(402).json({
      error: "adminId topilmadi darsni yuklab bo'lmadi agar adminId bo'lmasa",
    });
  }

  if (!name || !req.body.courseId) {
    return res.status(402).json({
      error: "darslarni yuklashda name  courseId larni yuklash lozim",
    });
  }
  const lesson = req.files?.lessonVideo;
  let fileurl = firebaseDeployFile(lesson);

  let coursLesson;
  try {
    const user = await User.findById({ _id: adminId });

    // user adminniligini tekshirish
    if (user.userAdmin === true && !req.files?.lessonVideo) {
      coursLesson = new CourseLesson({
        courseId,
        name,
        description,
      });
      const lesson = await coursLesson.save();
      return res.status(200).json(lesson);
    } else if (user.userAdmin === true && req.files?.lessonVideo) {
      coursLesson = new CourseLesson({
        courseId,
        name,
        lessonVideo: fileurl,
        description,
      });
      const lesson = await coursLesson.save();
      return res.status(200).json(lesson);
    } else if (user.userAdmin === false) {
      return res.status(401).json({
        msg: "kechirasiz siz Admin emassiz sizga dars yuklash mumkinemas!",
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

router.put("/admin/lesson/update/:id", Auth, async (req, res, next) => {
  const { name, description } = req.body;
  const { id } = req.params;
  const lesson = req.files?.lessonVideo;

  try {
    if (lesson) {
      const fileurl = firebaseDeployFile(lesson);

      const updateCourseLesson = await CourseLesson.findById({ _id: id });

      updateCourseLesson.name = name ? name : updateCourseLesson.name;
      updateCourseLesson.lessonVideo = fileurl
        ? fileurl
        : updateCourseLesson.lessonVideo;
      updateCourseLesson.description = description
        ? description
        : updateCourseLesson.description;

      const updateLasseon = await updateCourseLesson.save();
      return res.status(200).json(updateLasseon);
    } else {
      const update = await CourseLesson.findByIdAndUpdate({ _id: id });
      // { $set: { name, description } },
      // { new: true }
      update.name = name ? name : update.name;
      update.description = description ? description : update.description;

      return res.status(200).json({ msg: "kurs muvafaqiyatli o'zgartirildi" });
    }
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

router.delete("/admin/lesson/delete/:id", Auth, async (req, res) => {
  const { id } = req.params;
  try {
    await CourseLesson.findByIdAndDelete({ _id: id });
    return res.status(200).json({ msg: "course successfuly deleted" });
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

router.post("/admin/courseBooks/create", Auth, async (req, res) => {
  const { courseId, name, urlBooks, description } = req.body;

  try {
    const coursBooks = req.files?.bookFile;
    const fileurl = firebaseDeployFile(coursBooks);

    const createBooks = new CourseBooks({
      name,
      bookFile: fileurl,
      urlBooks,
      description,
      courseId,
    });

    const book = await createBooks.save();
    return res.status(200).json(book);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

router.put("/admin/coursBooks/update/:id", Auth, async (req, res) => {
  const { id } = req.params;
  const { name, urlBooks, description } = req.body;
  const coursBooks = req.files?.bookFile;
  const fileurl = firebaseDeployFile(coursBooks);
  try {
    const updateBook = await CourseBooks.findById({ _id: id });

    updateBook.name = name ? name : updateBook.name
    updateBook.urlBooks = urlBooks ? urlBooks : updateBook.urlBooks
    updateBook.description = description ? description : updateBook.description
    updateBook.bookFile = fileurl ? fileurl : updateBook.bookFile
     const updatedBook = await updateBook.save()
    return res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

router.delete("/admin/coursBooks/delete/:id", Auth, async (req, res) => {
  const { id } = req.params;
  try {
    await CourseBooks.findByIdAndDelete({ _id: id });
    return res.status(200).json({ msg: "Kitob o'chirildi" });
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

module.exports = router;
