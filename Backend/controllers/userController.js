import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// Generate JWT token
const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};


// ================= REGISTER =================

const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Check all fields
        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Please fill all fields"
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const newUser = await user.save();

        // Create JWT token
        const token = createToken(newUser._id);

        res.json({
            success: true,
            message: "Registration successful",
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error"
        });
    }
};


// ================= LOGIN =================

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check all fields
        if (!email || !password) {
            return res.json({
                success: false,
                message: "Please enter email and password"
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Find user
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = createToken(user._id);

        res.json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error"
        });
    }
};


export { registerUser, loginUser };