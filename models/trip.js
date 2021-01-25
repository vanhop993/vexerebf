const mongoose = require("mongoose");
const { seatSchema } = require("./seat");

const tripSchema = new mongoose.Schema(
  {
    departurePlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
    },
    arrivalPlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
    },
    startedDate: {
      type:Date,
      required:true
    },
    departureTime: {
      type:Date,
      required:true
    },
    status:{
      type:String,
      default:'active'
    },
    seats: [seatSchema],
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
    },
    price: Number,
  },
  {
    timestamps: true, // gắn thêm thời gian tạo
  }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = { Trip };
