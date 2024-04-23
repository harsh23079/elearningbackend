const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const imageUploader = require("../utils/imageUploader");
require("dotenv").config();

const createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files.videoFile;
    if (!title || !timeDuration || description || !video || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    const uploadOnCloudnary = await imageUploader(
      video,
      process.env.FOLDER_NAME
    );
    const subSection = await SubSection.create({
      title,
      description,
      timeDuration,
      videoUrl: uploadOnCloudnary.secure_url,
    });
    const section = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSection._id,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
