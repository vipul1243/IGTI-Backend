const Course = require("../models/courseModel");
const ExamSet = require("../models/examSetModel");

// GET-SUBJECT
exports.getSubject = async (req, res) => {
  try {
    const courseExists = await Course.findOne({
      courseName: req.body.courseName,
    });
    if (!courseExists) {
      return res.send({
        success: false,
        message: "Course not found!",
      });
    }
    if (+req.body.semesterNumber > +courseExists.noOfSemester) {
      return res.send({
        success: false,
        message: "Invalid Semester Number",
      });
    }
    if (+req.body.semesterNumber - 1 >= courseExists.semesters.length) {
      return res.send({
        success: false,
        message: `${req.body.semesterNumber} semester subjects will be updated soon! Please be Patience`,
      });
    }

    //-------------------------
    const questionLengths = await Promise.all(
      courseExists.semesters[req.body.semesterNumber - 1].subjects.map(
        async (subjectName) => {
          const questions = await ExamSet.findOne({
            courseName: req.body.courseName,
            semesterNumber: req.body.semesterNumber,
            subjectName: subjectName.subjectName,
          }).select("questions");
          return {
            subjectName,
            questionLength: questions ? questions.questions.length : 0,
          };
        }
      )
    );
    //----------------------------
    return res.send({
      success: true,
      message: "subjects fetched successfully",
      data: courseExists.semesters[req.body.semesterNumber - 1],
      data1: questionLengths,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE-SUBJECT
exports.updateSubject = async (req, res) => {
  try {
    const courseExists = await Course.findOne({
      courseName: req.body.courseName,
    });
    if (!courseExists) {
      return res.send({
        success: false,
        message: "Course not found!",
      });
    }
    if (+req.body.semesterNumber > +courseExists.noOfSemester) {
      return res.send({
        success: false,
        message: "Invalid Semester Number",
      });
    }
    if (+req.body.semesterNumber - 1 >= courseExists.semesters.length) {
      return res.send({
        success: false,
        message: `${req.body.semesterNumber} semester subjects can not be updated`,
      });
    }

    const updatedCourse = await Course.findOneAndUpdate(
      {
        courseName: req.body.courseName,
        "semesters.semesterNumber": req.body.semesterNumber,
      },
      { $set: { "semesters.$.subjects": req.body.updatedSubjects } },
      { new: true }
    );

    return res.send({
      success: true,
      message: "subjects updated successfully",
      data: updatedCourse.semesters[req.body.semesterNumber - 1],
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ADD-SUBJECT
exports.addSubject = async (req, res) => {
  try {
    const courseExists = await Course.findOne({
      courseName: req.body.courseName,
    });
    if (!courseExists) {
      return res.send({
        success: false,
        message: "Course not found!",
      });
    }
    if (+req.body.semesterNumber > +courseExists.noOfSemester) {
      return res.send({
        success: false,
        message: "Invalid Semester Number",
      });
    }
    if (+req.body.semesterNumber - 1 >= courseExists.semesters.length) {
      return res.send({
        success: false,
        message: `New Subject can not be added in ${req.body.semesterNumber} semester`,
      });
    }

    const semesterToUpdate = courseExists.semesters.find(
      (semester) => semester.semesterNumber === req.body.semesterNumber
    );

    const isDuplicate = semesterToUpdate.subjects.some(
      (subject) => subject.subjectName === req.body.newSubjects[0].subjectName
    );

    if (isDuplicate) {
      return res.send({
        success: false,
        message: "subjects already exists in semester",
        data: semesterToUpdate.subjects,
      });
    }

    semesterToUpdate.subjects = semesterToUpdate.subjects.concat(
      req.body.newSubjects
    );

    await courseExists.save();

    return res.send({
      success: true,
      message: "subjects added successfully",
      data: semesterToUpdate.subjects,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// DELETE-SUBJECT
exports.deleteSubject = async (req, res) => {
  try {
    const courseExists = await Course.findOne({
      courseName: req.body.courseName,
    });
    if (!courseExists) {
      return res.send({
        success: false,
        message: "Course not found!",
      });
    }
    if (+req.body.semesterNumber > +courseExists.noOfSemester) {
      return res.send({
        success: false,
        message: "Invalid Semester Number",
      });
    }
    if (+req.body.semesterNumber - 1 >= courseExists.semesters.length) {
      return res.send({
        success: false,
        message: `Subject can not be deleted in ${req.body.semesterNumber} semester`,
      });
    }

    const semesterToUpdate = courseExists.semesters.find(
      (semester) => semester.semesterNumber === req.body.semesterNumber
    );

    semesterToUpdate.subjects = [];

    await courseExists.save();

    return res.send({
      success: true,
      message: "subjects updated successfully",
      data: semesterToUpdate,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// DELETE-PARTICULAR-SUBJECT
exports.deleteParticularSubject = async (req, res) => {
  try {
    const courseName = req.body.courseName;
    const semesterNumber = req.body.semesterNumber;
    const subjectName = req.body.subjectName;

    const course = await Course.findOne({ courseName });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find the specified semester in the course
    const semester = course.semesters.find(
      (s) => s.semesterNumber === semesterNumber
    );

    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    // Find the subject to delete in the semester
    const subjectIndex = semester.subjects.findIndex(
      (subject) => subject.subjectName === subjectName
    );

    if (subjectIndex === -1) {
      return res
        .status(404)
        .json({ message: "Subject not found in the specified semester" });
    }

    // Remove the subject from the semester's subjects array
    semester.subjects.splice(subjectIndex, 1);

    // Save the updated course
    await course.save();

    return res.send({
      success: true,
      message: "subjects deleted successfully",
      data: course,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};
