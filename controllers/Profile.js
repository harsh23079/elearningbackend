const Profile = require("../models/Profile");
const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    const userId = req.user.id;

    if (!contactNumber || !gender || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    const userInfo = await User.findById(userId);
    const profileId = userInfo.additionalDetails;
    const userUpdate = await Profile.findByIdAndUpdate(
      profileId,
      {
        dateOfBirth,
        about,
        contactNumber,
        gender,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Detail updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deletedProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Not found",
      });
    }

    const userInfo = await User.findById(userId);
    const profileId = userInfo.additionalDetails;
    const userUpdate = await Profile.findByIdAndDelete(profileId);

    return res.status(200).json({
      success: true,
      message: "User Deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Not found",
      });
    }

    const userInfo = await User.findById(userId)
      .populate("additionDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Get info of User additional details",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { updateProfile, deletedProfile, getProfile };
