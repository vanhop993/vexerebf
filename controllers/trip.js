const { Trip } = require("../models/trip");
const { Ticket } = require("../models/ticket");
const mongoose = require("mongoose");
const Station = require("../models/station");
const Car = require("../models/card");
const { Seat } = require("../models/seat");

const getAllTrip = async(req, res) => {
  try{
    const trips = await Trip.find();
    console.log(trips);
    res.status(200).send(trips);
  }catch{(err) => {
    res.status(500).send({ message: err });
  }}
}
// transection : tạo ra 1 chuỗi action mà một trong số đó thất bại thì trả về trạng thái ban đầu
const postTrip = async (req, res) => {
  let {
    departurePlace,
    arrivalPlace,
    startedDate,
    departureTime,
    carId,
    price,
  } = req.body;
  startedDate = startedDate + " 00:00:00"; // cái này để fix lại khi lưu db thì sẽ chuyển về h quốc tế nên ta thêm thời gian vào để lưu cho chuẩn
  try {
    // check station   
    const foundedStations = await Station.find().or([
      { _id: departurePlace },
      { _id: arrivalPlace },
    ]);
    if (foundedStations.length !== 2)
      return res.status(400).send({ message: "Invalid station" });
    // check car
    const foundedCar = await Car.findById(carId);
    if (!foundedCar) return res.status(400).send({ message: "Invalid car" });
    const seatArray = [...new Array(foundedCar.seats)].map((_, index) => {
      return new Seat({
        name: index + 1,
        status: "avaiable",
      });
    });
    const newTrip = new Trip({
      departurePlace,
      arrivalPlace,
      startedDate,
      departureTime,
      seats: seatArray,
      car: carId,
      price,
    });
    const result = await newTrip.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
const getTrip = async (req, res) => {
  let { departurePlace, arrivalPlace, date } = req.query;
  date = date + " 00:00:00";
  try {
    const foundedTrips = await Trip.find({
      departurePlace,
      arrivalPlace,
      startedDate: date,
    }).populate("departurePlace arrivalPlace car", "licensePlate"); // tham số thứ 2 là các field mình muốn lấy
    console.log(Trip.find());
    res.send(foundedTrips);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};
const postBookTrip = async (req, res) => {
  const { tripId, seatId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Kiểm tra
    const foundedTrip = await Trip.findById(tripId).session(session);
    if (!foundedTrip)
      return res
        .status(400)
        .send({ massage: "Invalid trip , it is not exist!!" });
    // kiểm tra ghế có tồn tại không và status của ghế
    const indexSeat = foundedTrip.seats.findIndex(
      (seat) => seat._id.toString() === seatId && seat.status === "avaiable"
    );
    if (indexSeat === -1)
      return res.status(400).send({ massage: "Invalid seat!!" });

    // update trạng thái ghế
    foundedTrip.seats[indexSeat].userId = req.user._id;
    foundedTrip.seats[indexSeat].status = "booked";

    await foundedTrip.save();
    // tạo ticket
    // const newTicket = new Ticket({
    //   user: req.user._id,
    //   trip: foundedTrip._id,
    //   seats: [foundedTrip.seats[indexSeat]],
    // });
    // await newTicket.save();
    // tạo ticket bằng session

    Ticket.create(
      [
        {
          user: req.user._id,
          trip: foundedTrip._id,
          seats: [foundedTrip.seats[indexSeat]],
        },
      ],
      { session: session }
    );

    // nếu dùng session thì mọi thứ bên trên chưa lưu vào db mà lưu tạm chỗ khác
    await session.commitTransaction(); //khi commitTransaction thì nó mới lưu dữ liệu vào db;
    session.endSession(); // kết thúc Transaction
    res.status(200).send({ message: "Book ticket successfully" });
  } catch (err) {
    await session.abortTransaction(); // cái này là khi error thì sẽ hủy hết tất cả các thao tác đã làm
    session.endSession();
    res.status(500).send({ error: err });
  }
};
const deleteTrip = async(req,res) => {
  const {tripId} = req.body;
  try{
    const foundedTrip = await Trip.findById(tripId);
    if (!foundedTrip)
      return res
        .status(400)
        .send({ massage: "Invalid trip , it is not exist!!" });
    const indexSeatStatus = foundedTrip.seats.findIndex(item => item.status === "booked");
    if(indexSeatStatus !== -1) 
      return res
          .status(400)
          .send({ massage: "The trip has been booked , can't delete trip!!" });
    foundedTrip.status = "inactive";
    const result = await foundedTrip.save();
    res.status(200).send({message:"Delete trip successfully!!"})
  }catch{(err) => res.status(500).send({ error: err });}
} 
module.exports = { postBookTrip, getTrip, postTrip ,deleteTrip , getAllTrip};
