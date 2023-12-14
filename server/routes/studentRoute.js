const express = require("express");
const Student = require("../models/studentModel");
const EnrollNumber = require("../models/extraCourseModel");
const {
  registerStudentByEmail,
  loginStudent,
  getStudent,
  registerStudentById,
  allStudentId,
  allStudentCourse,
  verifyEnrollNumber,
  registerStudentByEnroll,
  deleteStudent,
  changeEnroll,
} = require("../controllers/studentController");
const multer = require("multer");
const router = express.Router();

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];
    // cb(null, uniqueSuffix+file.originalname);
    // cb(null, `files-admin-${Date.now()}.jpg`);
    cb(null, `files-admin-${uniqueSuffix}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] === "jpeg" ||
    file.mimetype.split("/")[1] === "png" ||
    file.mimetype.split("/")[1] === "jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// STUDENT-REGISTRATION
// router.route("/register").post(registerStudent);
router.post("/register", upload.single("fileName"), async (req, res) => {
  try {
    const studentExists = await Student.findOne({ email: req.body.email });
    if (studentExists) {
      return res.send({
        success: false,
        message: "Email is already registered with us!",
      });
    }

    const studentExists2 = await Student.findOne({
      mobileNumber: req.body.mobileNumber,
    });
    if (studentExists2) {
      return res.send({
        success: false,
        message: "Contact No. is already registered with us!",
      });
    }

    if (req.file === undefined) {
      return res.send({
        success: false,
        message: "Please select image File",
      });
    }

    req.body.imageFile = req.file.filename;

    const course = await EnrollNumber.findOne();
    req.body.enrollNo = course.enNumber;
    let enNumber = parseInt(course.enNumber, 10);
    enNumber += 1;
    const enNumberStr = enNumber.toString().padStart(8, "0");
    course.enNumber = enNumberStr;
    await course.save();

    const student = new Student(req.body);
    await student.save();

    return res.send({
      success: true,
      message: "Student registered Successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/update/:id", upload.single("fileName"), async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({ _id: id });

    if (req.file !== undefined) {
      const filePath = path.join(__dirname, "../../public", student.imageFile);
      await fs.unlink(filePath);
      req.body.imageFile = req.file.filename;
    } else {
      req.body.imageFile = student.imageFile;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedStudent) {
      return res.send({ success: false, message: "Student not found" });
    }

    return res.send({
      success: true,
      message: "Student Updated Successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// STUDENT_LOGIN
router.route("/login").post(loginStudent);

// GET-STUDENT-DETAILS-BY-TOKEN
router.route("/get-student").get(getStudent);

// GET-STUDENT-DETAILS-BY-EMAIL
router.route("/get-student-id").post(registerStudentByEmail);

// GET-STUDENT-DETAILS-BY-ID
router.route("/get-student-id-detail").post(registerStudentById);

router.route("/get-student-id-enroll").post(registerStudentByEnroll);

// GET-STUDENT-ALL-ID
router.route("/get-student-all-id").get(allStudentId);

// GET-STUDENT-ALL-COURSE
router.route("/get-student-all-course").post(allStudentCourse);

router.route("/verify-student").post(verifyEnrollNumber);

router.route("/delete-student-by-id/:id").delete(deleteStudent);

router.route("/change-status").post(changeEnroll);

module.exports = router;
