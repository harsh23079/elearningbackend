const Course = require("../models/Course");
const Section = require("../models/Section");

const createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    const newSection = await Section.create({ sectionName });

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    const Section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.body;
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    const Section = await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { createSection, updateSection, deleteSection };
