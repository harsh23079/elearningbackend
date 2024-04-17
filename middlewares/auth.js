const jwt = require("jsonwebtoken");

require("dotenv").config();

const authenticationToken = async (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorisation").replace("Bearer", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token is missing",
      });
    }
    try {
      const decode = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decode;
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "toke is not verified" + err.message,
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(500).json({
        success: false,
        message: "not authorized",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(500).json({
        success: false,
        message: "not authorized",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(500).json({
        success: false,
        message: "not authorized",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { authenticationToken, isStudent, isAdmin, isInstructor };
