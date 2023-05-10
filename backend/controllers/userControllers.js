const { UserModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcypt = require("bcrypt");
require("dotenv").config()

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.find({ email });
    if (!user.length) {
      bcypt.hash(password, parseInt(process.env.salt),async (err, hash) => {
        if (err) {
          console.log(err,hash);
          res.status(200).json({ message: "Something went wrong.",error:"invalid credentials" });
        } else {
          try {
            let newUser = UserModel({ email, password: hash });
            await newUser.save();
            res.status(200).json({ message: "signup successful" });
          } catch (err) {
            res.status(200).json({ message: "user already exist.",error:err.message });
          }
        }
      });
    } else {
      res.status(200).json({ message: "user already exist." });
    }
  } catch (err) {
    res
      .status(403)
      .json({ message: "something went wrong.", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.find({ email });
    if (user.length) {
      bcypt.compare(password, user[0].password, (err, result) => {
            console.log('result:', result)
            if (err) {
                res.status(200).json({ message: "something went wrong.",error:"invalid credentials" });
              } else {
                if(result){
                let token = jwt.sign(
                  {
                    data: "foobar",
                    userId:user[0]._id
                  },
                  "secret",
                  { expiresIn: "1h" }
                );
              res.status(200).json({message:"login successful",token})
              }
              else{
              res.status(200).json({message:"invalid Credentials"})
              }
            }
      });
    } else {
        res.status(200).json({message:"user not found"})
    }
  } catch (err) {
    res
      .status(200)
      .json({ message: "something went wrong.", error: err.message });
  }
};


module.exports = {signup,login}