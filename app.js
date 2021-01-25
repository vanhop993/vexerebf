const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("./db/connect");
const path = require("path");

const tripRouter = require("./routers/trip");
const branchRouter = require("./routers/branch");
const carRouter = require("./routers/card");
const stationRouter = require("./routers/station");
const authRouter = require("./routers/auth");
const uploadRouter = require("./routers/upload");
const cors = require("cors");

const config = require("config");
// sgMail
//   .send({
//     from: "hieu@covergo.com",
//     to: "vanhop993@gmail.com",
//     subject: "Welcome to vexere",
//     // text: "welcome text send gmail",
//     html: "<h1 style='color:red'>dflksjdlfjsaldf</h1>",
//   })
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));
// create demo middleware
// request đi từ trên xuống dưới nên các api chung thì để trên đầu
// app.use((req, res, next) => {
//  // cái này thường dùng để check authentication, role
//   console.log("middleware xử lý chung");
//  // nếu login rồi thì next()
//   next();
// // nếu chưa login
//   res.send("Vui lòng đăng nhập");
// });
// app.use("/getCars", (req, res, next) => {
//   console.log("middleware xử lý getCards");
// });
// app.use("/createTrip", (req, res, next) => {
//   console.log("middleware xử lý tạo Trip");
//   //   res.send("request success!");
// });
// app.use("/createCar", (req, res, next) => {
//   console.log("middleware xử lý tạo Card");
//   // res.send("request success!");
// });
// thư viện login bằng facebook
const passport = require("passport");
const passportStratery = require("passport-facebook-token");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const jwtSignature = config.get('jwtSignature');
passport.use(
  "facebookToken",
  new passportStratery(
    {
      clientID: "849986432462828",
      clientSecret: "eb5ff3d6a86f8d800197c41dc1a154be",
    },
    async (accessToken, refreshToken, profile, done) => {
      const userEmail = profile.emails[0].value;
      const userAvartar = profile.photos[0].value;
      const foundedUser = await User.findOne({ email: userEmail });
      let user = foundedUser;
      if (!foundedUser) {
        const newUser = new User({
          email: userEmail,
          role: "user",
          avatar: userAvartar,
        });
        user = await newUser.save();
      }
      done(null, user);
    }
  )
);
/**
 * TODO
 * 1. CRUD Branch
 * 2. CRUD Card
 * 3. CRUD Trip
 * 4. CRUD Station
 * 5. CRUD Order
 * 6. Authentication , authorization
 * 7. upload file
 * 8. Chat module
 * 9. Booking ticket
 * 10. facebook login
 * cors
 * git
 * deploy
 */
// cors kiểm tra domain có giống ko 
app.use(cors({
  origin: "http://localhost:5500", // đây là domain và bây h app chỉ nhận request có domain này mà thôi
  optionsSuccessStatus: 200
}))
//app.use(bodyParser.json()); // đây là thư viện middleware bên ngoài dùng để đưa request frontend vào trong api của express
app.use(bodyParser.json());
// static là middleware truy suất đến file image để lấy hình
// lấy đường dẫn để chỉ định folder chưa hình
// __dirname là vị trí hiện tại đang đứng
// (__dirname,'images') vì app vs images cùng cấp nếu ko cùng cấp thì trong images có thể dùng ../ như bình thường.
// console.log(path.join(__dirname,'images'));

app.use("/images", express.static(path.join(__dirname, "images")));
// khi truy suất thì chỉ cần sử dụng tên hình thôi bỏ cái tên file static đi.
// '/images',express.static(path.join(__dirname,'images')) cái "/images" là hỗ trợ của express để sử dụng file hình khi đường dẫn hình có /images/tenhinh

app.use(tripRouter);

app.use(branchRouter);

app.use(carRouter);
app.use(stationRouter);

app.use(authRouter);
app.use(uploadRouter);
app.post(
  "/login/facebook",
  passport.authenticate("facebookToken", { session: false }),
  async (req, res) => {
   try{
    const token = await jwt.sign(
      {
        _id: req.user._id,
      },
      jwtSignature
    );
    req.user.tokens.push(token);
    await req.user.save();
    res.send(token);
   }catch{(err) => {
    res.status(500).send({ message: err });
   }}
  }
);

const PORT = config.get("port");
app.listen(PORT, () => {
  console.log("listening!!!");
});
