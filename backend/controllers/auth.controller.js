import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const register = async (req, res) => {
  try {
    const hashpwsd = bcrypt.hashSync(req.body.password, 7);

    const newUser = new User({
      ...req.body,
      password: hashpwsd,
    });

    const savedUser = await newUser.save();

    return res.status(201).json(savedUser);
  } catch (error) {
    return res.status(500).json({ err: "This Email already exists", error:error?.message });
  }
};

const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({error: "User not registered"});
    
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);

    if (!isCorrect) return res.status(400).json({error : "Invalid Credentials"});
    
    user.password=undefined

    const token = jwt.sign(
      {
        id:user._id,
        isSeller:user.isSeller,
      },
      process.env.JWT_KEY,
    )

    return res.status(200)
    .cookie("accessToken", token, {
      httpOnly: true, 
      secure: true, 
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
    }).json(user)

  } catch (error) {
    // console.log(error)
    return res.status(500).json({ err: "something went wrong", error:error?.message });
  }
};

const logout = async (req, res) => {
  
  try {
    const {accessToken} = req.cookies
    // console.log(accessToken);
    if(!accessToken) return res.status(401).json({error: "You are not authenticated"});

    return res.clearCookie("accessToken",{
      secure: true,
      httpOnly: true,
      sameSite: "none",
    }).status(200).json({message:"logged out"})

  } catch (error) {
    return res.status(500).json({ err: "something went wrong while logout", error:error?.message });
  }
};

export { register, login, logout };
