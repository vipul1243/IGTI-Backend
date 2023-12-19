const Notification = require("../models/notificationModel");

exports.addNotification = async (req, res) => {
  try {
    const { notification, notificationLink, youtubeLink } = req.body;
    const newNotification = new Notification({
      notification,
      notificationLink,
      youtubeLink,
    });
    await newNotification.save();

    return res.send({
      success: true,
      message: "Notification added Successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.getNotification = async (req, res) => {
  try {
    
    const notifications = await Notification.find(
      {},
      "_id notification youtubeLink"
    );

    const notificationArray = notifications.map(({ _id, notification }) => ({
      _id,
      notification,
    }));
    const youtubeLinkArray = notifications.map(({ _id, youtubeLink }) => ({
      _id,
      youtubeLink,
    }));

    return res.send({
      success: true,
      message: "Notifications get Successfully",
      notifications: notificationArray,
      youtubeLinks: youtubeLinkArray,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);

    return res.send({
      success: true,
      message: "Notifications delete Successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};
