const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(email, "Verification Email ", otp);
    console.log("successfully sent ", mailResponse);
  } catch (err) {
    console.log("error occured while sending email:", err);
    throw err;
  }
}
OTPSchema.pre("save", async (next) => {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
