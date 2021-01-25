const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("config");
const jwtSignature = config.get('jwtSignature');
// hàm auth này để check tokent
// closure là 1 function trả về 1 function khác , để có thể truyền tham số vào
const auth = (roles) => async (req, res, next) => {
  try {
    // hàm này check token coi đúng tai khoản không thi mới trả về chuyến đi
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.verify(token, jwtSignature); // tham số 1 là token , tham số thứ 2 là chữ ký
    const allowRolers = roles || ["admin", "user"]; // đây là định nghĩa quyền cho qua tức là nếu có roles thì lấy roles ko thì lấy cái ["admin", "user"]
    const foundedUser = await User.findOne({
      _id: decoded._id,
      tokens: token,
      role: { $in: allowRolers },
    });
    if (!foundedUser)
      return res.status(401).send({ message: "You are not authorized" });
    req.user = foundedUser; // cái này để cho api sau đó sử dụng
    req.token = token; // cái này để cho api sau đó sử dụng
    next();
  } catch (err) {
    res.status(401).send({ message: "You are not authorized" });
  }
};
module.exports = auth;
