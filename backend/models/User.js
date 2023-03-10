import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const {Schema} = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: true, 
    validate: {
      validator: validator.isEmail,
      message: 'Provide a valid email'
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    maxlength: 6,
    select: false,
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'my city',
  },
})

UserSchema.pre('save', async function () {
  if(!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expireIn: process.env.JWT_LIFETIME,
  })
}

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
}

export default mongoose.model("User", UserSchema);
