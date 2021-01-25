const express = require("express");
const router = express.Router();
const {postStation ,deleteStation} = require('../controllers/station');
const auth = require("../helpers/auth");

router.post("/station", postStation);

router.delete("/station", auth(["admin"]) ,deleteStation);
module.exports = router;
