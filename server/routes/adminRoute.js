const express = require("express");
const { loginAdmin } = require("../controllers/adminController");
const router = express.Router();
const authMiddleware = require("../config/authMiddleware");
const Admin = require("../models/adminModel");


// LOGIN-ADMIN
router.route("/login").post(loginAdmin);

router.get("/get-current-user", authMiddleware, async (req, res) => {
    try {
        const user = await Admin.findOne({_id: req.body.userId });
        user.password = undefined;
        return res.send({
            success: true,
            message: "User fetched successfully",
            data: user
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})

module.exports = router;