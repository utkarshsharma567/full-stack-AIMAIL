require("dotenv").config();

const { z } = require("zod");
const User = require("../models/user.model"); // Define a schema for a user
const sendEmail = require("../utils/sendEmial.js"); // ✅ correct spelling
const jwt = require("jsonwebtoken");

const userSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),

  email: z.string().email("Invalid email address").toLowerCase().trim(),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

//register api
exports.register = async (req, resp) => {
  try {
    // 1. Validate request body using Zod
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      return resp.status(400).json({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const { name, email, password } = result.data;

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return resp.status(400).json({
        message: "User already exists",
      });
    }

    //create otp or time
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); //OTP valid for 10 minutes

    // 3. Create new user
    const newUser = new User({
      name,
      email,
      password,
      otp,
      otpExpiry,
      // password will be hashed automatically (pre-save hook)
    });

    // 4. Save user to database
    await newUser.save();

    //otp send logic
    try {
      await sendEmail({
        to: email,
        subject: "Your OTP for AI COLD MAIL GENERATOR",
        text: `Your OTP code is ${otp}. It is valid for 10 minutes only.`,
      });
    } catch (error) {
      console.log("Error sending email:", error);
      return resp.status(500).json({
        // ✅ return stops execution
        message: "Error generating otp",
        error: error.message,
      });
    }

    resp.status(201).json({
      message: "User registered successfully",
       userId: newUser._id,
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    // 6. Handle errors
    console.log(error);
    resp.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.login = async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return resp
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password  +isVerified");
    if (!user) {
      return resp.status(400).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      return resp.status(400).json({ message: "User not verified please verify your email first" });
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
       return resp.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
 return resp.status(200).json({ message: "Login successfully",user:{username:user.name,email:user.email},token });

  } catch (error) {
    console.log(error)
           return resp.status(500).json({ message: "Error in login",error:error.message });

  }
};

exports.verifyOTP = async (req, resp) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return resp.status(400).json({ message: "Email and OTP are required" });
    }
    // Agar schema me kisi field par "select: false" laga hai,
    // to wo normally query me nahi aati.
    // Lekin .select('+fieldName') use karke hum us field ko
    // forcefully include (true jaisa behave) kar dete hain.
    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!user) {
      return resp.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return resp.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp) {
      return resp.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpiry < new Date()) {
      return resp.status(400).json({ message: "OTP has expired" });
    }

    user.isVerified = true;
    user.otp = undefined; //✔️ Security best practice (OTP reuse nahi hoga)
    user.otpExpiry = undefined;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return resp
      .status(200)
      .json({ message: "OTP verified successfully", token });
  } catch (error) {
    console.log(error);
    return resp
      .status(500)
      .json({ message: "Error verifying OTP ", error: error.message });
  }
};
