const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerator = require("otp-generator");

//sendOTP
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkEmailInOtp = await User.findOne({ email });
    if (checkEmailInOtp) {
      return res.status(401).json({
        success: false,
        message: "User already exist please login..!!",
      });
    }
    const unique = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const result = await OTP.findOne({ otp: unique });

    while (result) {
      unique = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: unique });
    }
    const response = await OTP.create({ email, otp: unique });
    res.status(200).json({
      success: true,
      message: "Otp successfully generated",
    });
    console.log(response);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//signUp
const signUp = async (req, res) => {
  try {
  } catch (err) {}
};

//Login
const Login = async (req, res) => {
  try {
  } catch (err) {}
};

//changePassword
const changePassword = async (req, res) => {
  try {
  } catch (err) {}
};

module.exports = { sendOTP, signUp, Login, changePassword };
