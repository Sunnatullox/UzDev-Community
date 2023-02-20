const { Router } = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const router = Router();

router.post("/signUp", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({
      error: "iltimos barcha malumotlarni to'liq kiriting nimadir qolib ketdi",
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
  try {
    // rearch user email
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(422)
        .json({ error: "bunday email avval ro'yhatdan o'tgan" });
    }
    if (!user) {
      // user password hashed
      const bcryptjs = await bcrypt.hash(password.toString(), 10);
      // user data db connected
      const newUser = new User({
        name:name,
        email:email,
        password: bcryptjs,
      });
      // connected data saved
      await newUser.save();

      const token = jwt.sign({ _id: newUser._id }, JWT_SECRET);

      const {_id, userAdmin, userAvatar, createdAt, updatedAt }= newUser;

      return res.status(200).json({
        token,
        createdAt:createdAt,
        user: { name:newUser.name, email:newUser.email, _id, userAdmin, userAvatar, createdAt, updatedAt },
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      error: "iltimos barcha malumotlarni to'liq kiriting nimadir qolib ketdi",
    });
  }
  try {
    // search user
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(422).json({
        error:
          "bunday email ro'yhatdan o'tmagan iltimos avval ro'yhatdan o'ting",
      });
    }
    //user password compaired
    const userPassed = await bcrypt.compare(
      password.toString(),
      userData.password
    );
    if (userPassed) {
      // created user token
      const token = jwt.sign({ _id: userData._id }, JWT_SECRET);
      const { name, email, _id, userAdmin, userCourse, userAvatar } = userData;
      return res.status(200).json({
        token,
        user: { name, email, _id, userAdmin, userCourse, userAvatar },
      });
    } else if (!userPassed) {
      return res
        .status(422)
        .json({ error: "parolingiz hato tekshirib qayta urinib ko'ring!" });
    }
  } catch (error) {
    res.status(500);
    throw new Error("Kechirasiz nimadur hato ketti: " + error);
  }
});

module.exports = router;
