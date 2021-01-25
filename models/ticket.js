const mongoose = require("mongoose");
const { seatSchema } = require("./seat");

const ticketSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        trip:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true,
        },
        seats:[seatSchema]
    },
    {
      timestamps: true, // gắn thêm thời gian tạo
    }
  );
  
  const Ticket = mongoose.model("Ticket", ticketSchema);
  module.exports = { Ticket };