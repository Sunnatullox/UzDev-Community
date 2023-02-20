const { Router } = require("express");
const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const User = mongoose.model("User");
const CourseLesson = mongoose.model("CourseLesson");
const CourseBooks = mongoose.model("Books");
const CourseComment = mongoose.model("CourseComment");
const Books = mongoose.model("Books");
const Auth = require("../middleware/Auth");
const bcrypt = require("bcryptjs");
const router = Router();
const { ObjectId } = require("mongodb");
const firebaseDeployFile = require("../firebaseDeployFile");

router.get("/", async (req, res) => {
  try {
    const page = 1;
    const pageSize = Number(req.query.pageLimt) || 10;
    const category = req.query.category;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : category
      ? {
        catigory: {
            $regex: req.query.category,
            $options: "i",
          },
        }
      : {};
    const count = await Course.countDocuments({ ...keyword });
    const products = await Course.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ _id: -1 });
    res.json({
      products,
      current_pageSize: page,
      last_pageSize: page + 1,
      pages: Math.ceil(count / pageSize),
      total: products.length,
      per_page: pageSize,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz serverda hatolik: " + error);
  }
});

router.get("/user/getCourseOne/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const coursResult = await Course.findById({ _id: id });
    const CourseComments = await CourseComment.find({
      courseId: coursResult._id.toString(),
    });
    const lesson = await CourseLesson.find({
      courseId: coursResult._id.toString(),
    });
    const books = await Books.find({
      courseId: coursResult._id.toString(),
    });

    const Author = await User.findById({ _id: coursResult.authorId });

    if (!coursResult) {
      return res
        .status(404)
        .json({ msg: "kechirasiz bunday kurs topilmadi id hato" });
    }
    return res.status(200).json({
      cours: coursResult,
      Author,
      lesson: lesson,
      books,
      comment: CourseComments,
    });
  } catch (error) {
    next()
  }
});

router.get("/getCourseComment/:id", Auth, async (req, res) => {
  const { id } = req.params;

  try {
    const CourseComments = await CourseComment.findOne({ _id: id });

    if (!CourseComments) {
      return res
        .status(404)
        .json({ msg: "kechirasiz bunday comment topilmadi id hato" });
    }
    return res.status(200).json(CourseComments);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz serverda hatolik: " + error);
  }
});

router.get("/getCourseBook/:id", Auth, async (req, res) => {
  const { id } = req.params;

  try {
    const coursBooks = await CourseBooks.findOne({ _id: id });

    if (!coursBooks) {
      return res
        .status(404)
        .json({ msg: "kechirasiz bunday kitop topilmadi id hato" });
    }
    return res.status(200).json(coursBooks);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz serverda hatolik: " + error);
  }
});

router.put("/user/cuourseEnrole/:id", Auth, async (req, res) => {
  //Course id params id hisoplanadi
  const { id } = req.params;
  const { userId, userPay } = req.body;
  // const {id:userId} = req.user
  if (!userId) {
    return res.status(402).json({ error: "kechirasiz userId topilmadi!" });
  }
  try {
    const userCourseSearch = await Course.findById({ _id: id });

    const enrolledUser = await userCourseSearch.courseUsersInfo.some(
      (item) => item.userId == userId
    );

    if (enrolledUser) {
      return res
        .status(201)
        .json({ msg: "Siz bu kursni harid qilib bo'lgansiz!" });
    }

    const enroleCourseUser = await Course.updateOne(
      { _id: ObjectId(id) },
      {
        $push: {
          courseUsersInfo: {
            purchasedDate: new Date(),
            userId:Number(userId),
            paid: Number(userPay),
          },
        },
      },
      { upsert: true }
    );
    if (enroleCourseUser) {
      const userCourseEnrole = await User.updateOne(
        { _id: userId },
        { $push: { userCourseId: id } }
      );
      return res.status(200).json({ userCourseEnrole });
    }
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz serverda hatolik: " + error);
  }
});

router.get("/user/getCourseProfile/:id", Auth, async (req, res) => {
  //User id chunkiy userning profelida courlarning idilari bor id hisoplanadi
  const { id } = req.params;
  
  try {
    const searchUser = await User.findById({ _id: id });
    const userCourseId = await searchUser.userCourseId.map((i) => i);
    const userCourse = await Course.find({ _id: { $in: userCourseId } });

    return res.status(200).json(userCourse);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz serverda hatolik: " + error);
  }
});

router.get("/user/getCourseOneProfile/:id", Auth, async (req, res) => {
  const { id } = req.params;

  try {
    const coursResult = await Course.findById({ _id: id });
    const coursLesson = await CourseLesson.findOne({
      courseId: coursResult._id.toString(),
    });
    const coursBooks = await CourseBooks.findOne({
      courseId: coursResult._id.toString(),
    });
    const CourseComments = await CourseComment.findOne({
      courseId: coursResult._id.toString(),
    });

    if (!coursResult) {
      return res
        .status(404)
        .json({ msg: "kechirasiz bunday kurs topilmadi id hato" });
    }
    return res.status(200).json({
      cours: coursResult,
      lesson: coursLesson,
      books: coursBooks,
      comment: CourseComments,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz serverda hatolik: " + error);
  }
});

// router.post("/user/courseRate/:id", async (req, res) => {
//   const { userId, rating } = req.body;
//   const { id } = req.params;

//   if (!userId) {
//     return res.status(402).json({ error: "kechirasiz userId topilmadi!" });
//   }

//   try {
//     const userCourseSearch = await Course.findById({ _id: ObjectId(id) });

//     const courseSearchUserId = await userCourseSearch.courseRating.some(
//       (item) => item.userId == userId
//     );

//     // if (courseSearchUserId) {
//     //   return res
//     //     .status(201)
//     //     .json({ msg: "kechirasiz siz bu kursga baho berib bo'lgansiz!" });
//     // }
//      const data = await Course.findById({_id:id})

//     let result = await data.courseRating.reduce((acumulator, value) => {
//      return acumulator += value.ratings;
//      },0)

//     await Course.findByIdAndUpdate(
//       { _id: ObjectId(id) },
//       {
//         $set: {
//           courseRating: {
//             userId,
//           },
//         },
//         $set: {"courseRating.$.ratings":result},
//       },
//       { new: true }
//     );

//     return res.status(200).json("siz muvafaqiyatli baho qo'shdingiz");
//   } catch (error) {
//     console.log(error);
//   }
// });

router.put("/user/userCourseDelete/:id", Auth, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) {
    return res.status(402).json({ error: "kechirasiz userId topilmadi!" });
  }

  const userCourseSearch = await Course.findById({ _id: id });

  const enrolledUser = userCourseSearch.courseUsersId.map(
    (i) => i.toString() === userId.toString()
  );
  const findUserCours = enrolledUser.find((i) => i === true);

  if (!findUserCours) {
    return res.status(201).json({ msg: "Siz endi kursda mavjut emassiz" });
  }
  try {
    const courseDeletedUserId = await Course.findByIdAndUpdate(
      { _id: id },
      { $pull: { courseUsersId: userId } },
      { new: true }
    );
    if (courseDeletedUserId) {
      await User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { userCourseId: id } }
      );
      return res.status(200).json({ msg: "Siz Kursdan o'chirildingiz" });
    }
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz serverda hatolik: " + error);
  }
});

router.put("/user/profileUpdate", Auth, async (req, res) => {
  const { name, email, newPassword, userId, oldPassword } = req.body;
  const avatar = req.files?.userAvatar;

  try {
    const user = await User.findById({ _id: userId });
    if (newPassword) {
      const adminpasscompair = await bcrypt.compare(
        oldPassword.toString(),
        user.password
      );

      if (!adminpasscompair) {
        return res.status(422).json({
          msg: "Kechirasiz eski parolingiz hato!",
        });
      }
    }

    const bcryptjs = await bcrypt.hash(newPassword, 10);

    let fileurl = firebaseDeployFile(avatar)

      const userInfo = await User.findByIdAndUpdate({ _id: userId });

      userInfo.name = name ? name : userInfo.name
      userInfo.email = email ? email : userInfo.email
      userInfo.password = bcryptjs ? bcryptjs : userInfo.password
      userInfo.userAvatar = fileurl ? fileurl : userInfo.userAvatar

    const updatedUserInfo =  await userInfo.save()
      return res.status(200).json(updatedUserInfo);

  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz serverda hatolik: " + error);
  }
});

router.post("/user/forgotPassword/searchUser", Auth, async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ msg: "email topilmadi emailni kiritib qaytadan urinib ko'ring" });
  }
  try {
    const userSearch = await User.findOne({ email: email });

    if (!userSearch) {
      return res.status(404).json({
        msg: "kechirasiz bunday email ro'yhatdan o'tmagan boshqa email kiriting!",
      });
    }
    return res.status(200).json(userSearch);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz serverda hatolik: " + error);
  }
});

router.post("/user/fotgetPassword/updatedPasword", Auth, async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res
      .status(400)
      .json({ msg: "parol topilmadi parolni kiritib qaytadan urinib ko'ring" });
  }
  try {
    const bcryptjs = await bcrypt.hash(password.toString(), 10);
    const userupdatePass = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { password: bcryptjs } }
    );

    return res.status(200).json(userupdatePass);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz serverda hatolik: " + error);
  }
});

module.exports = router;
