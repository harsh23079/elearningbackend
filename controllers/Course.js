const Category = require("../models/Category");
const imageUploader = require("../utils/imageUploader");
const Course = require("../models/Course");
require("dotenv").config();

const createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      CategoryId,
      price,
    } = req.body;

    const thumbnail = req.files.thumbnailImage;

    if (
      !courseDescription ||
      !courseName ||
      !whatYouWillLearn ||
      !CategoryId ||
      !price ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        messsage: "All fields are required",
      });
    }
    const instructorId = req.user.id;

    const CategoryDetails = await Category.findById(CategoryId);

    if (!CategoryDetails) {
      return res.status(400).json({
        success: false,
        messsage: "Category Detail not found",
      });
    }

    const thumbnailImage = await imageUploader(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const response = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      Category: CategoryId,
      instructor: instructorId,
    });

    const userUpdate = await User.findByIdAndUpdate(
      { instructorId },
      {
        $push: {
          courses: response._id,
        },
      },
      { new: true }
    );

    const CategoryUpdate = await Category.findByIdAndUpdate(
      { CategoryId },
      {
        $push: {
          courses: response._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      messsage: "successfully course created",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      messsage: "Failed to create Course",
      error: err.messsage,
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({}).populate("instructor").exec();
    return res.status(200).json({
      success: true,
      messsage: "Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      messsage: "Failed to get all Course",
      error: err.messsage,
    });
  }
};

module.exports = { createCourse, getAllCourses };
