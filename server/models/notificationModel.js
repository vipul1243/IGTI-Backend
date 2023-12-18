const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    notification: {
      type: String,
      required: true,
    },
    notificationLink: {
      type: String,
      required: true,
    },
    youtubeLink: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("notifications", notificationSchema);

module.exports = Notification;
