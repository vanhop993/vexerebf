const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required:true
    },
    licensePlate: {
      type:String,
      required:true
    },
    seats: {
      type:Number,
      required:true
    },
    status:{
      type:String,
      default:"active",
    }
  },
  {
    timestamps: true, // gắn thêm thời gian tạo
  }
);

const Car = mongoose.model("Car", carSchema);
module.exports = Car;
