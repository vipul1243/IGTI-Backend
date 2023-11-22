const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");


// LOGIN-ADMIN
exports.loginAdmin = async (req, res) => {
    try {
        const admin = await Admin.findOne({userName: req.body.userName});
        if(!admin) {
            return res.send({
                success: false,
                message: "Admin not found! For Information Contact Us"
            })
        }

        if(req.body.password !== admin.password) {
            return res.send({
                success: false,
                message: "Invalid Password"
            })
        }

        const token = jwt.sign({userId: admin._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"});
        return res.send({
            success: true,
            message: "Admin logged successfully",
            data: token
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
  };
