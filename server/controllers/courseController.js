const Course = require("../models/courseModel");
const ExtraCourse = require("../models/extraCourseModel");
const studentExtraModel = require("../models/studentExtraModel");
const studentModel = require("../models/studentModel");

// ADD-COURSE
exports.addCourse = async (req, res) => {
  try {
    const courseExists = await Course.findOne({
      courseName: req.body.courseName,
    });
    if (courseExists) {
      return res.send({
        success: false,
        message: "This Course is already present in database!",
      });
    }

    const course = new Course(req.body);
    await course.save();

    const students = await studentExtraModel.find({
      courseName: req.body.courseName,
    });

    if (students.length !== 0) {
      for (let i = 0; i < students.length; i++) {
        req.body.studentName = students[i].studentName;
        req.body.email = students[i].email;
        req.body.fatherName = students[i].fatherName;
        req.body.dateOfBirth = students[i].dateOfBirth;
        req.body.mobileNumber = students[i].mobileNumber;
        req.body.city = students[i].city;
        req.body.state = students[i].state;
        req.body.pincode = students[i].pincode;
        req.body.address = students[i].address;
        req.body.courseName = students[i].courseName;
        req.body.imageFile = students[i].imageFile;
        req.body.enrollNo = students[i].enrollNo;
        const set = new studentModel(req.body);
        await set.save();
      }
    }

    await studentExtraModel.deleteMany({
      courseName: req.body.courseName,
    });

    return res.send({
      success: true,
      message: "Course added Successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const courseExists = await Course.findOne({
      courseName: req.body.courseName,
    });
    if (!courseExists) {
      return res.send({
        success: false,
        message: "Course not found",
      });
    }
    return res.send({
      success: true,
      message: "Course fetched successfully",
      data: courseExists,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// GET-ALL-COURSE-NAME
exports.getCourseName = async (req, res) => {
  try {
    const courses = await Course.find({}, "courseName"); // Only retrieve the courseName field

    const courseNames = courses.map((course) => course.courseName);
    // const courseExists = await Course.findOne({ courseName: req.body.courseName });
    // if (!courseExists) {
    //   return res.send({
    //     success: false,
    //     message: "Course not found",
    //   });
    // }
    return res.send({
      success: true,
      message: "Courses fetched successfully",
      data: courseNames,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        noOfSemester: req.body.noOfSemester,
        duration: req.body.duration,
        fees: req.body.fees,
        coursePassword: req.body.coursePassword,
      },
      { new: true }
    );
    if (!updatedCourse) {
      return res.send({
        success: false,
        message: "Course not found",
      });
    }

    const course = await Course.findById(courseId);

    if (req.body.noOfSemester < course.semesters.length) {
      const semestersToRemove = course.semesters.length - req.body.noOfSemester;
      course.semesters.splice(-semestersToRemove);
    }
    if (req.body.noOfSemester > course.semesters.length) {
      const semestersToAdd = req.body.noOfSemester - course.semesters.length;
      const lastSemesterNumber = course.semesters.length + 1;

      for (let i = 0; i < semestersToAdd; i++) {
        const newSemester = {
          semesterNumber: (lastSemesterNumber + i).toString(),
          subjects: [],
        };
        course.semesters.push(newSemester);
      }
    }

    await course.save();

    return res.send({
      success: true,
      message: "Course updated successfully",
      // data: updatedCourse,
      data: course,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.send({
        success: false,
        message: "Course not found",
      });
    }
    return res.send({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyPassword = async (req, res) => {
  try {
    const courseName = req.body.courseName;
    const password = req.body.password;
    const courseExists = await Course.findOne({
      coursePassword: password,
      courseName: courseName,
    });
    if (!courseExists) {
      return res.send({
        success: false,
        message: "Wrong Password!",
      });
    }

    if (courseExists.courseName !== courseName) {
      return res.send({
        success: false,
        message: "Please select right course!",
      });
    }

    return res.send({
      success: true,
      message: "Course fetched successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};
