import User from '../models/User.js';
import { HttpStatusCode } from 'axios';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import attachCookie from '../utils/attachCookie.js';

const register = async (req, res) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError('please provide all values');
  }

  const userAlreadyExists = await User.findOne({email})

  if(userAlreadyExists){
    throw new BadRequestError('User already exists')
  }else{
    const user = await User.create({name, email, password});
    const token = user.createJWT();
    attachCookie({res, token});
    res.status(HttpStatusCode.create).json({
      user:{
        email: user.email,
        name: user.name,
        email: user.email
      },
      location: user.location,
    });
  };
};

const login = async( req, res) => {
  const {email, password} = req.body;
  if(!email || !password) {
    throw new BadRequestError('Please fill out every field');
  }
  //find user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);;
  if(isPasswordCorrect){
    const token = user.createJWT();
    attachCookie({res, token});
    user.password = undefined;

    res.status(HttpStatusCode.Ok).json({user, location: user.location});
  }else {
    throw new UnAuthenticatedError('Invalid Email or Password');
  }
}
const updateUser = async (req, res) => {
  const {email, name, location} = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.location = location

  await user.save();

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, location: user.location });
}

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000)
  });
  res.status(HttpStatusCode.Ok).json({message: 'You have been looged out!'});
}

export {register, login, updateUser, getCurrentUser, logout};
