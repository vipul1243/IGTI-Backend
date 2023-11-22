const Student = require("../models/studentModel");
const jwt = require("jsonwebtoken");
const fs = require('fs/promises');
const path = require('path');

// STUDENT-REGISTRATION
exports.registerStudentByEmail = async (req, res) => {
  try {
    // console.log(req.body)
    const studentExists = await Student.findOne({ email: req.body.email });
    if (!studentExists) {
      return res.send({
        success: false,
        message: "Student not found!",
      });
    }

    return res.send({
      success: true,
      message: "Student fetched Successfully",
      data: studentExists,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.registerStudentById = async (req, res) => {
  try {
    // console.log(req.body)
    const studentExists = await Student.findOne({ _id: req.body.id });
    if (!studentExists) {
      return res.send({
        success: false,
        message: "Student not found!",
      });
    }

    return res.send({
      success: true,
      message: "Student fetched Successfully",
      data: studentExists,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.registerStudentByEnroll = async (req, res) => {
  try {
    const studentExists = await Student.findOne({ enrollNo: req.body.enroll });
    if (!studentExists) {
      return res.send({
        success: false,
        message: "Student not found!",
      });
    }

    return res.send({
      success: true,
      message: "Student fetched Successfully",
      data: studentExists,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN-STUDENT
exports.loginStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.body.email });
    if (!student) {
      return res.send({
        success: false,
        message: "Student not found! For Registration Contact Administration",
      });
    }

    if (req.body.dateOfBirth !== student.dateOfBirth) {
      return res.send({
        success: false,
        message: "Invalid DOB",
      });
    }

    const token = jwt.sign(
      { userId: student._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    return res.send({
      success: true,
      message: "Student logged successfully",
      data: token,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// GET-STUDENT-DETAILS-BY-TOKEN
exports.getStudent = async (req, res) => {
  try {
    req.body.userId = "653374fa12383679b1411abb";
    const student = await Student.findOne({ _id: req.body.userId });
    if (!student) {
      return res.send({
        success: false,
        message: "Student not found",
      });
    }
    return res.send({
      success: true,
      message: "Student details fetched successfully",
      data: student,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// GET-STUDENT-ALL-ID
exports.allStudentId = async (req, res) => {
  try {
    const students = await Student.find({}, "_id");
    const studentIds = students.map((student) => student._id);

    return res.send({
      success: true,
      message: "Student details fetched successfully",
      data: studentIds,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// GET-STUDENT-ALL-COURSE
exports.allStudentCourse = async (req, res) => {
  try {
    const courseName = req.body.courseName;

    const students = await Student.find({ courseName });

    if (students.length == 0) {
      return res.send({
        success: false,
        message: "No Student registered with this course!",
      });
    }

    const sortedStudents = students.sort((a, b) => {
      return a.enrollNo.localeCompare(b.enrollNo, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

    const studentIds = sortedStudents.map((student) => student._id);

    return res.send({
      success: true,
      message: "Student details fetched successfully",
      data: studentIds,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyEnrollNumber = async (req, res) => {
  try {
    const enrollNo = req.body.enrollNo;

    const students = await Student.find({ enrollNo: enrollNo });

    if (students.length == 0) {
      return res.send({
        success: false,
        message: "Enrollment number does not exist!",
      });
    }

    if (students[0].courseName !== req.body.courseName) {
      return res.send({
        success: false,
        message: "You are not enroll in this course!",
      });
    }

    return res.send({
      success: true,
      message: "Student details fetched successfully",
      data: students,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.send({
        success: false,
        message: "Student not found!",
      });
    }

    const filePath = path.join(__dirname, '../../public', existingStudent.imageFile);
    await fs.unlink(filePath);

    await Student.findByIdAndRemove(studentId);

    return res.send({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.changeEnroll = async (req, res) => {
  try {
    const studentEnroll = req.body.enrollNo;

    const existingStudent = await Student.findOne({enrollNo: studentEnroll});
    if (!existingStudent) {
      return res.send({
        success: false,
        message: "Student not found!",
      });
    }

    if(existingStudent.authorized) {
      existingStudent.authorized = false;
    }
    else {
      existingStudent.authorized = true;
    }

    await existingStudent.save();

    return res.send({
      success: true,
      message: "Status Changed",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};
