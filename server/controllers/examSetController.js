const ExamSet = require("../models/examSetModel");
const Course = require("../models/courseModel");
const ResultSet = require("../models/resultSetModel");
const FinalResult = require("../models/finalResultModel");
const Student = require("../models/studentModel");
const studentExtraModel = require("../models/studentExtraModel");

// ADD-EXAM-SET
exports.addExamSet = async (req, res) => {
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
    if (
      +req.body.semesterNumber > +courseExists.noOfSemester ||
      +req.body.semesterNumber < 1
    ) {
      return res.send({
        success: false,
        message: "Invalid Semester Number",
      });
    }
    if (+req.body.semesterNumber - 1 >= courseExists.semesters.length) {
      return res.send({
        success: false,
        message: `Exam Set can not be added in ${req.body.semesterNumber} semester`,
      });
    }

    const semesterToUpdate = courseExists.semesters.find(
      (semester) => semester.semesterNumber === req.body.semesterNumber
    );

    const isDuplicate = semesterToUpdate.subjects.some(
      (subject) => subject.subjectName === req.body.subjectName
    );

    if (!isDuplicate) {
      return res.send({
        success: false,
        message: `${req.body.subjectName} is not present in ${req.body.semesterNumber} semester (${req.body.courseName})`,
        data: semesterToUpdate.subjects,
      });
    }
    const examSetExists = await ExamSet.findOne({
      courseName: req.body.courseName,
      semesterNumber: req.body.semesterNumber,
      subjectName: req.body.subjectName,
    });
    if (!examSetExists) {
      const examSet = new ExamSet(req.body);
      await examSet.save();
      return res.send({
        success: true,
        message: `Question added successfully in ${req.body.courseName} - ${req.body.semesterNumber} semester (${req.body.subjectName})`,
      });
    }

    //------------------------------

    const questionTextCountMap = {};
    const duplicateQuestions = [];

    req.body.questions.forEach((question, index) => {
      const questionText = question.questionText;
      if (questionTextCountMap[questionText]) {
        const existingQuestionIndex = questionTextCountMap[questionText] - 1;
        duplicateQuestions.push({
          questionNumber: index + 1,
          duplicateOf: existingQuestionIndex + 1,
          questionText: questionText,
        });
      } else {
        questionTextCountMap[questionText] = index + 1;
      }
    });

    if (duplicateQuestions.length > 0) {
      const message = duplicateQuestions.map((duplicate) => {
        return `Question No ${duplicate.questionNumber} is a duplicate of Question No ${duplicate.duplicateOf}. Question Text: "${duplicate.questionText}"`;
      });
      return res.send({
        success: false,
        message: message,
      });
    }

    const optionTextMap = {};

    const duplicateOptions = req.body.questions.reduce(
      (duplicates, question, questionIndex) => {
        const { questionText, options } = question;
        options.forEach((option, optionIndex) => {
          const { optionText } = option;
          const key = `${questionText}:${optionText}`;
          if (optionTextMap[key] === undefined) {
            optionTextMap[key] = [questionIndex];
          } else {
            optionTextMap[key].push(questionIndex);
            duplicates.push({
              questionNo: questionIndex + 1,
              questionText,
              optionText,
            });
          }
        });
        return duplicates;
      },
      []
    );

    if (duplicateOptions.length > 0) {
      const message = duplicateOptions.map((duplicate) => {
        return `Question No ${duplicate.questionNo}: "${duplicate.questionText}" has duplicate option "${duplicate.optionText}"`;
      });
      return res.send({
        success: false,
        message: message,
      });
    }

    //------------------------------
    if (examSetExists) {
      examSetExists.questions = req.body.questions;
      await examSetExists.save();
      return res.send({
        success: true,
        message: `Questions added successfully in ${req.body.courseName} - ${req.body.semesterNumber} semester (${req.body.subjectName})`,
      });
    }
    //------------------------------

    const isPresent = examSetExists.questions.some((question) =>
      req.body.questions.some(
        (ques) => ques.questionText === question.questionText
      )
    );
    let x = "";
    let y = "";
    const value = examSetExists.questions.some((question) =>
      req.body.questions.some((ques, index) => {
        if (ques.questionText === question.questionText) {
          x = ques.questionText;
          y = index + 1;
          return;
        }
      })
    );

    if (isPresent) {
      return res.send({
        success: false,
        message: `Question No. ${y} -  ("${x}") is already present in ${req.body.courseName} - ${req.body.semesterNumber} semester (${req.body.subjectName})`,
        data: examSetExists,
      });
    }

    const optionTextCount = {};
    let xx = 0;
    for (const question of req.body.questions) {
      const questionText = question.questionText;
      xx = xx + 1;

      for (const option of question.options) {
        const optionText = option.optionText;

        const key = `${questionText}-${optionText}`;

        if (optionTextCount[key]) {
          return res.send({
            success: false,
            message: `In Question ${xx}. ("${questionText}") - option ("${optionText}") is repeated in ${req.body.courseName} - ${req.body.semesterNumber} semester (${req.body.subjectName})`,
          });
        }
        optionTextCount[key] = 1;
      }
    }

    examSetExists.questions = examSetExists.questions.concat(
      req.body.questions
    );
    await examSetExists.save();

    const examSetDetails = await ExamSet.findOne({
      courseName: req.body.courseName,
      semesterNumber: req.body.semesterNumber,
      subjectName: req.body.subjectName,
    });

    return res.send({
      success: true,
      message: `Another set of Questions added successfully in ${req.body.courseName} - ${req.body.semesterNumber} semester (${req.body.subjectName})`,
      data: examSetDetails,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// GET-EXAM-SET
exports.getExamSet = async (req, res) => {
  try {
    const examSetCourseExists = await ExamSet.findOne({
      courseName: req.body.courseName,
    });

    if (!examSetCourseExists) {
      return res.send({
        success: false,
        message: "Invalid Course!",
      });
    }

    const examSetSemesterExists = await ExamSet.findOne({
      courseName: req.body.courseName,
      semesterNumber: req.body.semesterNumber,
    });

    if (!examSetSemesterExists) {
      return res.send({
        success: false,
        message: "Invalid Semester!",
      });
    }

    const examSetExists = await ExamSet.findOne({
      courseName: req.body.courseName,
      semesterNumber: req.body.semesterNumber,
      subjectName: req.body.subjectName,
    });

    if (!examSetExists) {
      return res.send({
        success: false,
        message: "Invalid Subject!",
      });
    }

    return res.send({
      success: true,
      message: `Exam Set fetched successfully`,
      data: examSetExists.questions,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// DELETE-EXAM-SET-QUESTION
exports.deleteExamSetQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;

    const examSetExists = await ExamSet.findOne({
      courseName: req.body.courseName,
      semesterNumber: req.body.semesterNumber,
      subjectName: req.body.subjectName,
    });

    if (!examSetExists) {
      return res.send({
        success: false,
        message: "Something went wrong! Try again",
      });
    }

    const questionIndex = examSetExists.questions.findIndex(
      (q) => q._id.toString() === questionId
    );

    if (questionIndex === -1) {
      return res.send({
        success: false,
        message: "Question not found!",
      });
    }

    examSetExists.questions.splice(questionIndex, 1);

    await examSetExists.save();

    return res.send({
      success: true,
      message: `Exam Set question deleted successfully`,
      data: examSetExists.questions,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// DELETE-EXAM-SET
exports.deleteExamSet = async (req, res) => {
  try {
    const deleteResult = await ExamSet.deleteMany({
      courseName: req.body.courseName,
    });

    await ResultSet.deleteMany({
      courseName: req.body.courseName,
    });

    await FinalResult.deleteMany({
      courseName: req.body.courseName,
    });

    const students = await Student.find({ courseName: req.body.courseName });

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
        const set = new studentExtraModel(req.body);
        await set.save();
      }
    }

    const deleteStudent = await Student.deleteMany({
      courseName: req.body.courseName,
    });

    return res.send({
      success: true,
      message: `Deleted ${deleteResult.deletedCount} courses with the given courseName`,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};
