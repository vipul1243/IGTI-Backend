const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        optionText: {
          type: String,
          required: true,
        },
      },
    ],
    correctOption: {
        type: String,
        required: true,
    }
  });

const examSetSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    semesterNumber: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("examSets", examSetSchema);
