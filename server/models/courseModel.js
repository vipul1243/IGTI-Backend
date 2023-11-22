const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String, 
    required: true
  },
});

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      unique: true,
    },
    noOfSemester: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    fees: {
      type: String,
      required: true,
    },
    coursePassword : {
      type: String,
      default: ""
    },
    semesters: [
      {
        semesterNumber: {
          type: String,
          required: true,
        },
        subjects: [subjectSchema],
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("courses", courseSchema);
