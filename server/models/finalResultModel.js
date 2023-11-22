const mongoose = require('mongoose');

const subjectResultSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
  numCorrectAnswers: {
    type: Number,
    required: true,
  },
  totalNumQuestions: {
    type: Number,
    required: true,
  },
});

const resultSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  semesterNumber: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  subjectResults: [subjectResultSchema],
  isDeclared: {
    type: Boolean,
    default: false,
  },
});

const Result = mongoose.model('finalResults', resultSchema);

module.exports = Result;
