const express = require("express");
const router = express.Router();
const auth = require("../helpers/auth");
const {postBookTrip, getTrip, postTrip, deleteTrip} =require("../controllers/trip");

router.post("/trip", auth(["admin"]), postTrip);

router.get("/trip", auth(), getTrip);

router.post("/trip/booking",auth(),postBookTrip);

router.delete("/trip",auth(["admin"]), deleteTrip)

module.exports = router;
