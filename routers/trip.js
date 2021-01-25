const express = require("express");
const router = express.Router();
const auth = require("../helpers/auth");
const {postBookTrip, getTrip, postTrip, deleteTrip, getAllTrip} =require("../controllers/trip");

router.post("/trip", auth(["admin"]), postTrip);

router.get("/trip", auth(), getTrip);

router.get("/alltrip",getAllTrip);

router.post("/trip/booking",auth(),postBookTrip);

router.delete("/trip",auth(["admin"]), deleteTrip);

module.exports = router;
