const express = require("express");
const router = express.Router();
const {postCard, deleteCar} = require("../controllers/card");
const auth = require("../helpers/auth");

router.post("/car", postCard);
router.delete("/car", auth(["admin"]), deleteCar)

module.exports = router;
