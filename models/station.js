const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    name: {
      type:String,
      required:true,
    },
    address: {
      type:String,
      required:true
    },
    provice: {
      type:String,
      required:true
    },
    code: {
      type:String,
      required:true
    },
    status:{
      type:String,
      default:"active"
    }
  },
  {
    timestamps: true, // gắn thêm thời gian tạo
  }
);

const Station = mongoose.model("Station", stationSchema);
module.exports = Station;
