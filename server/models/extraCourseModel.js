const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    enNumber: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("extra-courses", courseSchema);
