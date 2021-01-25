const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type:String,
      required:true,
    },
    hotline: {
      type:String,
      required:true,
    },
    code: {
      type:String,
      required:true
    },
    address: {
      type:String,
      required:true
    },
    status:{
      type:String,
      default: "active",
    }
  },
  {
    timestamps: true, // gắn thêm thời gian tạo
  }
);

const Branch = mongoose.model("Branch", branchSchema);
module.exports = Branch;
