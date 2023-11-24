import mongoose from "mongoose"

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique : true
  },
  
  email: {
    type: String,
    required: true,
    unique : true
  },

  isVerifed : {
    type:Boolean,
    default:false,
  },
  isAdmin: {
    type:Boolean,
    default:false,
  },
  password: {
    type: String,
    required: true,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpire: Date,
  verifyToken: String,
  verifyTokenExpire: Date,
  refreshToken: String,
});


const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;