const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const categoryDetail = await Category.create({
      name,
      description,
    });
    return res.status(200).json({
      success: true,
      message: categoryDetail,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const showAllCategory = async (req, res) => {
  try {
    const allCategory = Category.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All Category returned successfully " + allCategory,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports = { createCategory, showAllCategory };
