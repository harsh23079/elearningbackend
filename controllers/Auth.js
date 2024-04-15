const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");

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
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !otp
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Fields are required.." });
    }
    const checkEmailInOtp = await User.findOne({ email });
    if (checkEmailInOtp) {
      return res.status(401).json({
        success: false,
        message: "User already exist please login..!!",
      });
    }
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password and confirmPassword does not match",
      });
    }

    const recentOtp = OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
    if (recentOtp.length === 0) {
      return res.status(400).json({ success: false, message: "OTP Not found" });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const profileDetail = {
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    };
    const profileResponse = await Profile.create(profileDetail);
    const encryptPassword = bcrypt.hash(password, 10);
    const response = await User.create({
      firstName,
      lastName,
      email,
      password: encryptPassword,
      accountType,
      otp: recentOtp,
      additionalDetails: profileResponse._id,
    });
    res.status(200).json({
      success: true,
      message: "SignUp successfully",
    });
    console.log(response);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
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
