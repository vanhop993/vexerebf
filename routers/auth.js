const express = require("express");
const router = express.Router();
// sendgrid mail
const auth = require("../helpers/auth");
const {
  postAuthSignUp,
  postAuthSignIn,
  getAuthMe,
  postAuthLogout,
} = require("../controllers/auth");

router.post("/signup", postAuthSignUp);
router.post("/signin", postAuthSignIn);

router.get("/me", auth(), getAuthMe);

router.post("/logout", auth(), postAuthLogout);

module.exports = router;
