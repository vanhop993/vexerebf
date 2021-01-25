const sgMail = require("@sendgrid/mail");
const User = require("../models/user");
const config = require("config");
// bcryptjs để băm password
const bcrypt = require("bcryptjs");
// jsonwebtoken để tạo token
const jwt = require("jsonwebtoken");
const sgAPIKey = config.get("sgAPIKey");
sgMail.setApiKey(
  sgAPIKey
);
const jwtSignature = config.get('jwtSignature');
const postAuthSignUp = async (req, res) => {
  const { username, password, email, phone } = req.body;
  try {
    const foundedUser = await User.findOne().or([{ username }, { email }]);
    if (foundedUser)
      return res.status(400).send({ message: "User already exist!!" });
    // hash Password
    // const hashPassword = await bcrypt.hash(password, 8);
    const newUser = new User({
      username,
      password,
      email,
      phone,
      role: "user",
    });
    const result = await newUser.save();
    // result = result.toObject();
    // delete result.password;
    // send email welcome
    sgMail
      .send({
        from: "hieu@covergo.com",
        to: result.email,
        subject: "Welcome to vexere",
        // text: "welcome text send gmail",
        html: "<h1 style='color:red'>Welcome</h1>",
      })
      .then((res) => console.log("success"))
      .catch((err) => console.log(err));
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
};

const postAuthSignIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check username
    const foundedUser = await User.findOne({ username });
    if (!foundedUser)
      res.status(401).send({ message: "Tài khoản hoặc mật khẩu không đúng" });
    // check password vì password đã bị băm
    const isMatch = bcrypt.compare(password, foundedUser.password);
    if (!isMatch)
      res.status(401).send({ message: "Tài khoản hoặc mật khẩu không đúng" });
    //generate token
    const token = await jwt.sign(
      {
        _id: foundedUser._id,
      },
      jwtSignature
    );
    console.log("token", token);
    // save token vào user login
    foundedUser.tokens.push(token);
    await foundedUser.save();
    // send result
    // const result = foundedUser.toObject();
    // delete result.password;
    res.send(token);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
};
const getAuthMe = async (req, res) => {
  // hàm toJSON được viết trong userSchema , là phương thức xóa field password vs token của user khi frontend lấy thông tin tài khoản
  const result = req.user.toJSON();
  // req.user đã đc tìm kiếm tron auth nên ta chỉ cần dùng lại
  res.send(result);
};
const postAuthLogout = async (req, res) => {
  const index = req.user.tokens.findIndex((token) => token === req.token);
  req.user.tokens.splice(index, 1);
  await req.user.save();
  res.send();
};
module.exports = { postAuthSignUp, postAuthSignIn, getAuthMe, postAuthLogout };
