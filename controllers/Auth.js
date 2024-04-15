const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
var jwt = require("jsonwebtoken");

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
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ success: false, message: "Fields are required.." });
    }
    const checkEmail = await User.findOne({ email });
    if (!checkEmail) {
      return res.status(401).json({
        success: false,
        message: "User is not exist please signUp..!!",
      });
    }

    const match = await bcrypt.compare(password, checkEmail.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Password is not matched",
      });
    }
    const payLoad = {
      id: checkEmail._id,
      email: checkEmail.email,
      accountType: checkEmail.accountType,
    };
    const token = jwt.sign(payLoad, process.env.TOKEN_KEY);
    checkEmail.password = undefined;
    checkEmail.token = token;

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Logged in successfully 😊 👌", checkEmail });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//changePassword
const changePassword = async (req, res) => {
  try {
    const { email, newPassword, oldPassword } = req.body;
    if (!email || !newPassword || !oldPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Fields are required.." });
    }
    const checkPassword = User.findOne({ email });
    const match = await bcrypt.compare(password, checkPassword.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Old Password is not matched" });
    }

    const hashNewPassword = bcrypt.hash(newPassword, 10);
    const response = User.create({ password: hashNewPassword });
    console.log(response);
    res.status(200).json({ message: "Password changes successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { sendOTP, signUp, Login, changePassword };
