const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

const resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;

    //check user for this email, email validation
    const userInfo = await User.findOne({ email });
    if (!userInfo) {
      return res.status(401).json({
        success: false,
        message: "Email is not registered",
      });
    }

    //generate token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updateResponse = await User.findOneAndUpdate(
      { email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );

    //create url
    const url = `http://localhost:3000/update-password/${token}`;

    //send mail containing the url
    await mailSender(email, "Password Reset Link", url);

    //return response
    res.status(200).json({
      success: true,
      message: "Reset Password link sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password not matching",
      });
    }

    //get userdetails from db using token
    let userDetails = await User.findOne({ token });

    //if no entry -invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }

    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired",
      });
    }

    //hash pwd
    const hashPassword = await bcrypt.hash(password, 10);

    //password update
    userDetails = await User.findOneAndUpdate(
      { token },
      { password: hashPassword },
      {
        new: true,
      }
    );
    //return response
    res.status(200).json({
      success: true,
      message: "Successfully update password" + userDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { resetPasswordToken, resetPassword };
