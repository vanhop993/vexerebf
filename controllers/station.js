const Station = require("../models/station");
const { Trip } = require("../models/trip");


const postStation = async (req, res) => {
  const { name, address, provice, code } = req.body;
  try {
    const findStation = await Station.findOne({ code });
    if (findStation)
      return res.status(400).send({ message: "Station is exsited" });
    const newStation = new Station({
      name,
      address,
      provice,
      code,
    });
    const result = await newStation.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

const deleteStation = async (req, res) => {
  // delete thì gửi query chứ ko gửi req.body
  const { id } = req.query;
  // const { code } = req.body;
  try {
    const foundedStation = await Station.find({_id:id,status:"active"});
    if(!foundedStation) return res.status(400).send({ message: "Station isn't exsited" });
    const foundedStationFromTrip = await Trip.findOne().or([{departurePlace: id},{arrivalPlace:id}]);
    if(foundedStationFromTrip) return res.status(400).send({ message: "Can't delete station, the station is in use!!" });
    foundedStation.status = "inactive";
    await foundedStation.save();
    res.status(500).send({ message: "delete success!!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

module.exports = { postStation , deleteStation};