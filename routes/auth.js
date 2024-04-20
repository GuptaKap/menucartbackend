const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');


var JWT_SECRET = "hide";

router.post('/signup', [
    body('name', 'Enter a Valid Name').isLength({ min: 4 }),
    body('contactNo', 'Enter 10 digit number ').isLength({ min: 10, max: 10 }).isNumeric(),
    body('email', 'Enter a Valid Email').isEmail()

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, contactNo } = req.body;

    // Check if user already exists with this email or contact number
    try {
        let existingUser = await User.findOne({
            $or: [
                { email: email },
                { contactNo: contactNo }
            ]
        });
        if (existingUser) {
            let errorMessage = "";
            if (existingUser.email === email) {
                errorMessage = "Sorry, a user with this email already exists.";
            } else if (existingUser.contactNo === contactNo) {
                errorMessage = "Sorry, a user with this contact number already exists.";
            }
            return res.status(400).json({ success: false, error: errorMessage });
        }

        // Create the user
        const user = await User.create({
            name: name,
            email: email,
            contactNo: contactNo
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error");
    }
});



module.exports = router;
