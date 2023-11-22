const express = require("express");
const { addCourse, getCourse, updateCourse, deleteCourse, getCourseName, verifyPassword } = require("../controllers/courseController");
const router = express.Router();


// ADD-COURSE
router.route("/add-course").post(addCourse);

// GET-COURSE-DETAILS
router.route("/get-Course").post(getCourse);

// GET-ALL-COURSE-NAME
router.route("/name-Course-all").post(getCourseName);

router.route("/verify-password").post(verifyPassword);

// UPDATE-COURSE-DETAILS
router.route("/update-Course/:id").put(updateCourse);

// DELETE-COURSE
router.route("/delete-Course/:id").delete(deleteCourse);

module.exports = router;
