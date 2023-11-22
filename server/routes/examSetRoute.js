const express = require("express");
const { addExamSet, getExamSet,deleteExamSetQuestion, deleteExamSet } = require("../controllers/examSetController");
const router = express.Router();


// ADD-EXAM-SET
router.route("/add-exams-set").post(addExamSet);

// GET-EXAM-SET
router.route("/get-exams-set").post(getExamSet);

// DELETE-EXAM-SET-QUESTION
router.route("/delete-exams-set-question/:questionId").post(deleteExamSetQuestion);

// DELETE-EXAM-SET
router.route("/delete-exams-set").post(deleteExamSet);


module.exports = router;