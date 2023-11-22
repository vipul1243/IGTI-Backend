const express = require("express");
const { addResultSet, getResultSet, getResultSetById, updateResultSetById, updateDeclared, getResult } = require("../controllers/resultSetController");
const router = express.Router();


// ADD-RESULT-SET
router.route("/add-result-set").post(addResultSet);

// GET-RESULT-SET
router.route("/get-result-set").post(getResultSet);


router.route("/get-result-set-set").post(getResult);

// SET-RESULT-SET-BY-ID
router.route("/get-result-set-id").post(getResultSetById);

// UPDATE-RESULT-SET-BY-ID
router.route("/update-result-set-id").post(updateResultSetById);

// UPDATE-IS-DECLARED
router.route("/update-declared").post(updateDeclared);


module.exports = router;