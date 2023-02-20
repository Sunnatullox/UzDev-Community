const { Router } = require("express");
const mongoose = require("mongoose");
const SuperAdmin = mongoose.model("SuperAdmin");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = mongoose.model("User");
const Catigory = mongoose.model("Catigorys");
const CourseLesson = mongoose.model("CourseLesson");
const Course = mongoose.model("Course");
const Auth = require("../middleware/Auth");
const router = Router();
const firebaseDeployFile = require("../firebaseDeployFile");

// Super Admin Sign Up
router.post("/superAdmin/signUp", async (req, res) => {
  const { name, email, password, secretInfo } = req.body;

  if (!name || !email || !password || !secretInfo) {
    return res.status(422).json({
      error: "Iltimos barcha malumotlarni to'liq kiriting nimadir qolib ketdi",
    });
  }
  // regex for email
  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    return res.status(422).json({
      error:
        "Kechirasiz emailingizni hato kiritdingiz iltimos emailni yaxshilab etiborbilan to'g'ri kiriting!",
    });
  }
  // regex for password
  if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{4,}$/.test(password)) {
    return res.status(422).json({
      error:
        "Kechirasiz parolingiz uzunligi 4 tadan kam bo'lmagan holda Kamida 1 ta Katta va kichik farf bo'lishligi va 1 ta raqam bo'lishligi lozim!",
    });
  }

  try {
    const SuperAdminData = await SuperAdmin.find();
    if (SuperAdminData.length >= 1) {
      res.status(422).json({
        error:
          "SuperAdmin 1 marta ro'yhatdan o'tgan qaytib ro'yhatdan o'tib bo'lmaydi.",
      });
      return;
    }

    // search SuperAdmin data
    const user = await SuperAdmin.findOne({ email });
    if (user) {
      return res
        .status(422)
        .json({ error: "bunday email avval ro'yhatdan o'tgan" });
    }
    if (!user) {
      // SuperAdmin password hashed
      const bcrypt = await bcryptjs.hash(password.toString(), 10);
      const bcryptjsSecretInfo = await bcryptjs.hash(secretInfo.toString(), 10);
      // SuperAdmin data db connected
      const user = new SuperAdmin({
        name,
        email,
        secretInfo: bcryptjsSecretInfo,
        password: bcrypt,
      });
      // connected data saved
      await user.save();
      return res
        .status(200)
        .json({ msg: "Admin Panelga ro'yhatdan o'tdingiz!" });
    }
  } catch (error) {
    res.status(500)
    throw new Error({ error: "ro'yhatdan o'tib bo'lmadi qaytadan urinib ko'ring" });
  }
});

// Super Admin Sign In
router.post("/superAdmin/signIn", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      error: "iltimos barcha malumotlarni to'liq kiriting nimadir qolib ketdi",
    });
  }

  try {
    // search SuperAdmin Data
    const userData = await SuperAdmin.findOne({ email });

    if (!userData) {
      return res.status(422).json({
        error:
          "bunday email ro'yhatdan o'tmagan iltimos avval ro'yhatdan o'ting",
      });
    }
    //SuperAdmin password compaired
    const userPassed = await bcryptjs.compare(password, userData.password);
    if (userPassed) {
      // created SuperAdmin token
      const token = jwt.sign({ _id: userData._id }, JWT_SECRET);

      const { name, email, _id, userAdmin, userCourse, userAvatar } = userData;
      return res.status(200).json({
        token,
        user: { name, email, _id, userAdmin, userCourse, userAvatar },
      });
    } else {
      return res
        .status(422)
        .json({ error: "akountga kirib bo'ladi qaytadan urinib ko'ring" });
    }
  } catch (error) {
    res.status(500)
    throw new Error({ error: "Admin Panelga kirib bo'ladi qaytadan urinib ko'ring" });
  }
});

// syper admin create Categories and subCategories
router.post("/superAdmin/createCategry", Auth, async (req, res) => {
  const { title, description, keywords, keywordTags, categoryId } = req.body;
  let keyword;

  if (keywords) {
    keyword = keywords.split(",");
  }

  const categoryImage = req.files?.categoryImage;
  if (!categoryImage) {
    return res
      .status(422)
      .json(
        "kechirasiz category qo'shish uchun rasimni ham kiritishlik majbury"
      );
  }
  const fileurl = firebaseDeployFile(categoryImage);

  try {
    if (!categoryId) {
      const getCatigory = await Catigory.findOne({ title: title });
      if (getCatigory) {
        res.status(400).json("kechirasiz bunday category avvaldan mavjud");
        return;
      }

      const newCategory = new Catigory({
        title,
        categoryImage: fileurl,
        description,
        keywords: keyword ? keyword : keywordTags,
      });
      await newCategory.save();

      return res.status(201).json(newCategory);
    } else {
      const getCatigory = await Catigory.findById({
        _id: categoryId,
      });

      // add new category if categoryId not found
      if (!getCatigory) {
        const newCategory = new Catigory({
          title,
          categoryImage: fileurl,
          description,
          keywords: keyword ? keyword : keywordTags,
        });
        await newCategory.save();
        return res.status(201).json(newCategory);
      }
      // Check whether there is a subCategory
      const CheckSubCategory = getCatigory.subcatigory.find(
        (item) => item.title.toString() === title.toString()
      );
      if (CheckSubCategory) {
        res.status(400);
        throw new Error("kechirasiz bunday sub category avvaldan mavjud");
      }

      const subCategory = {
        subCatigorytitle: title,
        subCatigoryDescription: description,
        subCatigoryKeywords: keyword ? keyword : keywordTags,
      };
      getCatigory.subcatigory.push(subCategory);
      const newSubCategory = await getCatigory.save();

      return res.status(201).json(newSubCategory);
    }
  } catch (error) {
    res.status(500)
    throw new Error("kechirasiz kategorya qo'shib bo'lmadi")
  }
});

// syper admin get all Categories and subCategories
router.get("/superAdmin/getCategrys", Auth, async (req, res) => {
  try {
    const categorys = await Catigory.find();

    if (!categorys) {
      res.status(404).json("Kechirasiz hechqanday kategory topilmadi!");
    }

    res.status(201).json(categorys);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error );
  }
});

// syper admin update Categories and subCategories
router.put("/superAdmin/updateCategry", Auth, async (req, res) => {
  const {
    title,
    description,
    keywords,
    isActive,
    keywordTags,
    categoryId,
    subCategoryId,
  } = req.body;
  let keyword;

  if (keywords) {
    keyword = keywords.split(",");
  }

  try {
    const categoryImage = req.files?.categoryImage;

    const fileurl = firebaseDeployFile(categoryImage);

    if (categoryId && !subCategoryId) {
      const category = await Catigory.findById({ _id: categoryId });

      if (!category) {
        res.status(404).json("kechirasiz bunday category topilmadi!");
        return;
      }
      category.title = title ? title : category.title;
      category.categoryImage = fileurl ? fileurl : category.categoryImage;
      category.description = description ? description : category.description;

      category.keywords = keywords
        ? keyword
        : keywordTags
        ? keywordTags
        : category.keywords;
      category.isActive = isActive ? isActive : category.isActive;
      const newCategory = await category.save();

      return res.status(201).json(newCategory);
    } else if (categoryId && subCategoryId) {
      const catigory = await Catigory.findById({ _id: categoryId });

      if (catigory) {
        const subCategory = catigory.subcatigory.find(
          (item) => item._id.toString() === subCategoryId.toString()
        );

        if (!subCategory) {
          return res.status(404).json("kechirasiz bunday subcategory topilmdi");
        }

        const newSubCategory = {
          "subcatigory.$.subCatigorytitle":
            title !== "" ? title : subCategory.subCatigorytitle,
          "subcatigory.$.subCatigoryDescription":
            description !== ""
              ? description
              : subCategory.subCatigoryDescription,
          "subcatigory.$.subCatigoryKeywords":
            keywords !== ""
              ? keyword
              : keywordTags !== ""
              ? keywordTags
              : subCategory.subCatigoryImage,
          "subcatigory.$.subCatigoryIsActive":
            isActive !== "" ? isActive : subCategory.subCatigoryIsActive,
        };

        await Catigory.updateOne(
          { "subcatigory._id": subCategoryId },
          {
            $set: newSubCategory,
          },
          { new: true }
        );

        const updatedSubCategory = await Catigory.findById(categoryId);

        return res.status(201).json(updatedSubCategory);
      } else {
        return res.status(404).json("kechirasiz bunday kategory topilmadi!");
      }
    }
    stream.end(categoryImage.data);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// syper admin deleted Categories and subCategories
router.delete("/superAdmin/deletedCategry", Auth, async (req, res) => {
  const { categoryId, subCategoryId } = req.body;

  try {
    if (categoryId && !subCategoryId) {
      const category = await Catigory.findById({ _id: categoryId });
      if (!category) {
        return res.status(404).json("kechirasiz bunday category topilmadi");
      }
      await Catigory.findByIdAndDelete({ _id: categoryId });

      return res
        .status(201)
        .json({ message: "category muvafaqiyatli o'chirildi" });
    } else if (categoryId && subCategoryId) {
      const catigory = await Catigory.findById({ _id: categoryId });

      if (catigory) {
        catigory.subcatigory.pull({ _id: subCategoryId });
        await catigory.save();

        return res.status(201).json(catigory);
      } else {
        return res.status(404).json("kechirasiz bunday kategory topilmadi!");
      }
    }
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// syper admin create Categories and subCategories
router.put("/superAdmin/updateIsActiveCourse", Auth, async (req, res) => {
  const { isActive, courseId } = req.body;
 
  try {

      const course = await Course.findById({_id: courseId})
      course.isActive = isActive ? isActive : course.isActive
  
      const updatedCategory = await course.save()
      return res.status(201).json(updatedCategory)

  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// syper admin create Categories and subCategories
router.put("/superAdmin/updateIsActiveLesson", Auth, async (req, res) => {
  const { isActive, lessonId } = req.body;
 
  try {

      const lesson = await CourseLesson.findById({_id: lessonId})
      lesson.isActive = isActive ? isActive : lesson.isActive
  
      const updatedCategory = await lesson.save()
      return res.status(201).json(updatedCategory)

  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// syper admin create Categories and subCategories
router.put("/superAdmin/updateIsActiveCatigory", Auth, async (req, res) => {
  const { isActive, categoryId, subCategoryId } = req.body;
 
  try {
    if(categoryId && !subCategoryId){
      const category = await Catigory.findById({_id: categoryId})
      category.isActive = isActive ? isActive : category.isActive
  
      const updatedCategory = await Catigory.save()
      return res.status(201).json(updatedCategory)
    }else if(categoryId && subCategoryId){
      const catigory = await Catigory.findById({ _id: categoryId });

      if (catigory) {
        const subCategory = catigory.subcatigory.find(
          (item) => item._id.toString() === subCategoryId.toString()
        );

        if (!subCategory) {
          return res.status(404).json("kechirasiz bunday subcategory topilmdi");
        }

        await Catigory.updateOne(
          { "subcatigory._id": subCategoryId },
          {
            $set: {isActive},
          },
          { new: true }
        );

        const updatedSubCategory = await Catigory.findById(categoryId);
        return res.status(201).json(updatedSubCategory);
      }else {
        return res.status(404).json("kechirasiz bunday kategory topilmadi!");
      }
    }
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// super admin get all users
router.get("/superAdmin/getAllUsers", Auth, async (req, res) => {
  try {
    const Alluser = await User.find();
    if (!Alluser) {
      return res.status(404).json({ msg: "Hechqanday userlar topilmadi" });
    }
    return res.status(200).json(Alluser);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// super admin get all admin
router.get("/superAdmin/getAllAdmin", Auth, async (req, res) => {
  try {
    const Alladmin = await User.find({ userAdmin: true });
    if (!Alladmin) {
      return res.status(404).json({ msg: "Hechqanday adminlar topilmadi" });
    }
    return res.status(200).json(Alladmin);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// superAdmin get price of courses sold
router.get("/superAdmin/priceCourseSold", Auth, async (req, res) => {
  let data = [];
  try {
    const courseprices = Course.find();
    (await courseprices).map((item) => {
      let summ = 0,
        month;
      function getArraySum(a) {
        for (var i in a) {
          summ += Number(a[i].paid);
          month = new Date(a[i].purchasedDate).getMonth();
        }
        return { _id: month, paymented: summ };
      }

      return data.push(getArraySum(item.courseUsersInfo));
    });

    return res.status(200).json(data);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// superAdmin get users Status
router.get("/superAdmin/usersStatus", Auth, async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json(data);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// super admin get one user
router.get("/superAdmin/getOneUser/:id", Auth, async (req, res) => {
  // user id search user
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ msg: "User topilmadi" });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// syperdmin created Admin
router.put("/superAdmin/createAdmin/:id", Auth, async (req, res) => {
  const { id } = req.params;
  const { userAdmin } = req.body;
  if (!userAdmin) {
    return res.status(422).json({
      error:
        "Iltimos Admin  qo'yilmadi! adminga malumot kiriting true yokiy false",
    });
  }
  try {
    const userAdmins = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { userAdmin } }
    );
    return res.status(200).json(userAdmins);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// super admin updata user
router.put("/superAdmin/updateUser/:id", Auth, async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const passHashed = await bcryptjs.hash(password.toString(), 10);
    // user password hashed
    const user = await User.findById({ _id: id });
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.password = passHashed ? passHashed : user.password;

    return res.status(200).json({ msg: "User malumotlari o'zgartirildi" });
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// syperdmin created Admin
router.delete("/superAdmin/deleteUser/:id", Auth, async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(404).json({ msg: "user topilmadi" });
  }
  try {
    // user password hashed
    await User.findByIdAndDelete({ _id: id });
    return res.status(200).json({ msg: "User O'chirildi" });
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

//Super SuperAdmin check email and secretInfo
router.post(
  "/superAdmin/superAdminUpdatePass/acountDataCheck",
  Auth,
  async (req, res) => {
    const { email, secretInfo } = req.body;
    if (!email || !secretInfo) {
      return res.status(422).json({
        error:
          "iltimos emailni va hafsizlik uchun secretInformatsiy ham kiriting",
      });
    }

    try {
      const adminData = await SuperAdmin.findOne({ email });
      if (!adminData) {
        return res.status(422).json({
          msg: "Kechirasiz Admin Emailiga Sizning emailingiz tuo'g'ri kelmadi.",
        });
      }
      const compairedSecretInfo = await bcryptjs.compare(
        secretInfo.toString(),
        adminData.secretInfo
      );
      console.log(compairedSecretInfo);
      if (!compairedSecretInfo) {
        return res.status(422).json({
          msg: "Kechirasiz Admin hafsizlik so'ziga sizning hafsizlik so'zingiz tuo'g'ri kelmadi.",
        });
      }
      return res.status(200).json({ Checked: "true", adminData });
    } catch (error) {
      res.status(500);
      throw new Error("Kechirasiz nimadur hato ketti: " + error);
    }
  }
);

//Super Admin Passsword Update
router.put("/superAdmin/updatePassword", Auth, async (req, res) => {
  const { password, adminId } = req.body;
  if (!adminId) {
    return res
      .status(401)
      .json({ msg: "Super Admin Id ni kiritishni unitdingiz id topilmadi!" });
  }
  try {
    //SuperAdmin password updated
    const adminPassHashed = await bcryptjs.hash(password.toString(), 10);
    const updateSuperAdmin = await SuperAdmin.findByIdAndUpdate(
      { _id: adminId },
      { $set: { password: adminPassHashed } }
    );
    return res.status(200).json(updateSuperAdmin);
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

// syper admin update profile
router.post("/superAdmin/updateProfile", Auth, async (req, res) => {
  const {
    name,
    email,
    oldPassword,
    newPassword,
    oldSecretInfo,
    newSecretInfo,
    adminId,
  } = req.body;
  if (!adminId) {
    return res
      .status(401)
      .json({ msg: "Super Admin Id ni kiritishni unitdingiz id topilmadi!" });
  }
  try {
    const admin = await SuperAdmin.findOne({ _id: adminId });
    if (!admin) {
      res.status(404).json("kechirasiz admin topilamdi");
    }
    if (newPassword) {
      const adminpasscompair = await bcryptjs.compare(
        oldPassword.toString(),
        admin.password
      );
      if (!adminpasscompair) {
        return res.status(422).json({
          msg: "Kechirasiz Admin paroliga sizning parolingiz to'g'ri kelmadi!",
        });
      }
    }

    if (newSecretInfo) {
      const adminsecretInfocompair = await bcryptjs.compare(
        oldSecretInfo.toString(),
        admin.secretInfo
      );

      if (!adminsecretInfocompair) {
        return res.status(422).json({
          error:
            "Kechirasiz Admin hafsizlik so'ziga sizning hafsizlik so'zingiz tuo'g'ri kelmadi.",
        });
      }
    }
    const secretInfoHashed = await bcryptjs.hash(newSecretInfo.toString(), 10);

    const passHashed = await bcryptjs.hash(newPassword.toString(), 10);

    const AdminAvatarFile = req.files?.adminAvatar;

    let fileurl = firebaseDeployFile(AdminAvatarFile)
    

      const SuperAdminUpdated = await SuperAdmin.findByIdAndUpdate({
        _id: adminId,
      });
      
      SuperAdminUpdated.name = name ? name : SuperAdminUpdated.name
      SuperAdminUpdated.email = email ? email : SuperAdminUpdated.email
      SuperAdminUpdated.password = passHashed ? passHashed : SuperAdminUpdated.password
      SuperAdminUpdated.secretInfo = secretInfoHashed ? secretInfoHashed : SuperAdminUpdated.secretInfo
      SuperAdminUpdated.adminAvatar = fileurl ? fileurl : SuperAdminUpdated.adminAvatar
      const updateprofileAdmin = await SuperAdminUpdated.save()

      return res.status(200).json(updateprofileAdmin);

  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

module.exports = router;
