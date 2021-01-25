const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type:String,
      trim:true,
      default:null,
    },
    password: {
      type:String,
      minlength: 8,
      trim: true,
      default:null,
    },
    email: {
      type:String,
      trim:true,
      validate(value){
        if (!validator.isEmail(value)) {
          throw new Error("Email không hợp lệ");
        }
      }
    },
    phone: {
      type:String,
      trim:true,
    },
    role: {
      type:String,
    },
    tokens: {
      type: [String],
      default: [],
    },
    avartar:String,
  },
  {
    timestamps: true, // gắn thêm thời gian tạo
  }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

// đây là middleware của mongoose sử dụng để trước khi save thì sẽ hash password
// không nên dùng arrow function ở đây
userSchema.pre("save", async function (next) {
  // hàm modified là để kt xem password có thay đổi ko thì mới hash
  // this. ở đây chính là cái newUser đc save ở app.js
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  // chỗ này phải có hàm next , nếu ko có thì sẽ bị treo tại đây
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
