const Car = require("../models/card");
const { Trip } = require("../models/trip");

const postCard = async (req, res) => {
  const { branchId, licensePlate, seats } = req.body;
  try {
    const findCar = await Car.findOne({ licensePlate });
    if (findCar) return res.status(400).send({ message: "Car is exsited" });
    const newCar = new Car({
      branch: branchId,
      licensePlate,
      seats,
    });
    const result = await newCar.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
const deleteCar = async(req,res)=>{
  const {id} = req.query;
  try{
    const foundedCar = await Car.findById(id);
    if(!foundedCar) return res.status(400).send( {message: "Car isn't exist!!"});
    // consst foundedCarFormTrip = await Trip.findOne({})
    // res.send();
  }catch{(err) => {
    res.status(500).send({ message: err });
  }}
}
module.exports = { postCard , deleteCar};
