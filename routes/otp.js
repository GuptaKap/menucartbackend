const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Import User model
var jwt = require('jsonwebtoken');


var JWT_SECRET = "hide";

const otpMap = new Map();

router.post('/otp', [
    // Validation middleware 
    body('email', 'Enter a Valid Email').isEmail()
], async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 2);
    // res.json({ otp, expiryTime });

    try {
        // Check if user exists
        let existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const data = {
            user:{
                id: existingUser.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success,authToken})

        // Send OTP email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "anushka.gupta5020@gmail.com",
                pass: "fpvj jawm eyjt znsl"
            },
        });

        transporter.sendMail({
            from: '"MenuCart" <MenuCart@gmail.com>',
            to: email,
            subject: "Login OTP for MenuCart",
            html: `<p>Hello,</p>
            <p>Thank you for logging in to MenuCart. Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
            <p>Please use this OTP to complete the login process. Note that this OTP is valid for one-time use and expires after a certain duration.</p>
            <p>If you did not request this OTP, please ignore this email. Your account security is important to us.</p>
            <p>Best regards,<br/>The MenuCart Team</p>`
        }, (err, message) => {
            if (err) {
                console.error("Error sending email:", err);
                res.status(500).json({ error: "Error sending email" });
            } else {
                // console.log("Email sent successfully:", message);
                otpMap.set(email, { otp, expiryTime });
                res.status(200).json({ message: "Done" });
            }
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/verify', async (req, res) => {
    const { email, otp } = req.body;
    // console.log("Received email and OTP:", email, otp);
    // console.log(otpMap.get(email));

    if (otpMap.has(email)) {
        const storedOTP = otpMap.get(email);
        const storedExpiryTime = storedOTP.expiryTime;

        // console.log("OTP found in otpMap:", otpMap.get(email));
        await Promise.resolve();

        if (new Date() > storedExpiryTime) {
            return res.status(400).json({ error: "OTP has expired" });
        }
        if (storedOTP.otp === otp) {
            res.status(200).json({ message: "correct" });
        } else {
            res.status(400).json({ error: "OTP is incorrect" });
        }
    } else {
        res.status(400).json({ error: "No OTP found for the email" });
    }
});

module.exports = router;
