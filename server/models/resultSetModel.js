const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  selectedOption: {
    type: String,
    required: true,
  },
});

const semesterResultSchema = new mongoose.Schema({
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
  resultSet: {
    type: [resultSchema],
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  isDeclared: {
    type: Boolean,
    default: false,
  }
});

const SemesterResult = mongoose.model('resultSets', semesterResultSchema);

module.exports = SemesterResult;
