const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

module.exports.forgotPassword = (req, res)  => {
    res.render("users/forgotPassword.ejs",{
        title: "Forgot Password | MandalGo"
    });
};

module.exports.sendOTP = async (req, res) => {
    try {
        let { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            req.flash("error", "Email is not registered!");
            return res.redirect("/forgot-password");
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP
        const hashedOTP = await bcrypt.hash(otp, 10);

        user.resetOTP = hashedOTP;
        user.expiryOTP = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        // Email transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "MandalGo Password Reset OTP",
            text: `Your MandalGo reset password OTP is ${otp}. It is valid for 5 minutes.`
        });

        req.flash("success", "OTP was sent!");
        return res.redirect("/reset-password");

    } catch (error) {
        console.log(error);
        req.flash("error", "Failed to send OTP");
        return res.redirect("/forgot-password");
    }
};
module.exports.resetPage = (req,res) => {
    res.render("users/resetPage.ejs", {
        title: "Reset Password | MandalGo"
    });
};

module.exports.resetPassword = async (req, res) => {
    try {
        let { email, resetOTP, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            console.log("ERROR: Passwords do not match");

            req.flash("error", "Passwords do not match");
            return res.redirect("/reset-password");
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log("ERROR: User not found");

            req.flash("error", "Email was not registered!");
            return res.redirect("/reset-password");
        }

        if (!user.resetOTP || !user.expiryOTP) {
            req.flash("error", "OTP is invalid or expired!");
            return res.redirect("/reset-password");
        }

        if (Date.now() > user.expiryOTP.getTime()) {
            req.flash("error", "OTP has expired!");
            return res.redirect("/reset-password");
        }

        const isValid = await bcrypt.compare(
            resetOTP,
            user.resetOTP
        );

        if (!isValid) {
            req.flash("error", "OTP does not match!");
            return res.redirect("/reset-password");
        }

        await user.setPassword(password);

        user.resetOTP = null;
        user.expiryOTP = null;

        await user.save();
        req.flash("success", "Password changed successfully!");
        return res.redirect("/login");

    } catch (error) {
        req.flash("error", "Something went wrong!");
        return res.redirect("/reset-password");
    }
};

