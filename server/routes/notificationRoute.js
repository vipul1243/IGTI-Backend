const express = require("express");
const { addNotification, getNotification, deleteNotification } = require("../controllers/notificationController");
const router = express.Router();

router.route("/add-notification").post(addNotification);

router.route("/get-notification").post(getNotification);

router.route("/delete-notification/:id").post(deleteNotification);

module.exports = router;
