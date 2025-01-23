import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  expertise: {
    type: String,
  },
  orders: {
    type: Number,
  },
  desc: {
    type: String,
  },
  isSeller: {
    type: Boolean,
    default:false
  },
},{
  timestamps:true
});

const User = mongoose.model("User", userSchema)
export default User