const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["Professor", "Student", "Admin"],
  },
  semester: { type: String },
  profilePicture:{type:String}
});

// Password Hashing Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

// Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded data to the request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token!" });
  }
};

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role, semester } = req.body;
    const user = new User({
      name,
      email,
      password,
      role,
      semester: role === "Student" ? semester : undefined,
    });
    await user.save();
    res.status(201).json({ message: "User registered!" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Email already exists!" });
    } else {
      res.status(500).json({ error: "Server error!" });
    }
  }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials!" });

    // JWT Token Generate
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token, message: "Login successful!" });
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});
// Get user profile
app.get("/api/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error); // Log any error for debugging
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/profile", authenticate, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Log the incoming request body for debugging purposes
    console.log("Received update request with data:", { name, email });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error in profile update:", error); // Log the actual error
    res.status(500).json({ error: "Profile update failed" });
  }
});

// Update User Profile
app.put("/api/user/update", authenticate, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// User Data Endpoint
app.get("/api/user", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Hide password
    if (!user) return res.status(404).json({ error: "User not found!" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

// Schedule Schema
const scheduleSchema = new mongoose.Schema({
  className: { type: String, required: true },
  professorName: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  semester: { type: String, required: true },
  cancelled: { type: Boolean, default: false },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

// API to Add a Class Schedule (Admin Only)
app.post("/api/schedule", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Only admin can add schedules" });
    }

    const {
      className,
      professorName,
      day,
      startTime,
      endTime,
      semester,
      cancelled,
    } = req.body;
    const newSchedule = new Schedule({
      className,
      professorName,
      day,
      startTime,
      endTime,
      semester,
      cancelled,
    });

    await newSchedule.save();
    res.status(201).json({ message: "Class schedule added successfully!" });
  } catch (error) {
    console.error("Error adding schedule:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

// API to Cancel or Reschedule a Class (Professors Only, if slots available)
app.put("/api/schedule/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "Professor") {
      return res
        .status(403)
        .json({ error: "Only professors can modify schedules" });
    }

    const { id } = req.params;
    const { day, startTime, endTime, cancelled } = req.body;

    const existingSchedule = await Schedule.findById(id);
    if (!existingSchedule)
      return res.status(404).json({ error: "Schedule not found!" });

    // Check if slot is available
    const slotExists = await Schedule.findOne({
      day,
      startTime,
      endTime,
      cancelled: false,
    });
    if (slotExists && slotExists._id.toString() !== id) {
      return res.status(400).json({ error: "Slot is already occupied!" });
    }

    existingSchedule.day = day || existingSchedule.day;
    existingSchedule.startTime = startTime || existingSchedule.startTime;
    existingSchedule.endTime = endTime || existingSchedule.endTime;
    existingSchedule.cancelled =
      cancelled !== undefined ? cancelled : existingSchedule.cancelled;

    await existingSchedule.save();
    res.json({ message: "Schedule updated successfully!" });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

// Fetch All Class Schedules
app.get("/api/schedule", authenticate, async (req, res) => {
  try {
    console.log(req.user._id);
    const schedule = await Schedule.find().sort({ day: 1, startTime: 1 });
    res.json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

// Leave Schema
const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  reason: { type: String },
});

const Leave = mongoose.model("Leave", leaveSchema);

// Mark Leave Endpoint
app.post("/api/mark-leave", authenticate, async (req, res) => {
  try {
    console.log(req);
    const { date, endDate, reason } = req.body;

    if (!date)
      return res.status(400).json({ error: "Start date is required!" });

    const startDate = new Date(date);
    let endDateObj = endDate ? new Date(endDate) : null;

    // Ensure valid start date
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: "Invalid start date!" });
    }

    // Ensure valid end date if provided
    if (endDate && isNaN(endDateObj.getTime())) {
      return res.status(400).json({ error: "Invalid end date!" });
    }

    // If endDate is provided, ensure it's not before the start date
    if (endDateObj && startDate > endDateObj) {
      return res
        .status(400)
        .json({ error: "End date cannot be earlier than start date!" });
    }
    const leave = new Leave({
      userId: req.user.userId,
      startDate,
      endDate: endDateObj,
      reason,
    });

    // Debugging leave object before saving
    console.log("Leave entry before save:", leave);

    await leave.save(); // Save the leave entry
    console.log("Leave entry saved:", leave);
    res.json({ message: "Leave marked successfully for the single date!" });
  } catch (error) {
    console.error("Error while marking leave:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

app.get("/api/leaves", authenticate, async (req, res) => {
  console.log("Request received for /api/leaves"); // Check if the route is hit
  try {
    if (req.user.role !== "Student") {
      return res.status(403).json({
        error: "Forbidden, only students can view professor's leave status!",
      });
    }

    console.log("Going to find professors");
    const leaves = await Leave.find({
      userId: { $in: await User.find({ role: "Professor" }).select("_id") },
    })
      .populate("userId", "name")
      .sort({ startDate: -1 });

    console.log("Professors found", leaves);
    res.json(
      leaves.map((leave) => ({
        professorName: leave.userId.name,
        startDate: leave.startDate,
        endDate: leave.endDate || leave.startDate, // agar start date null hai end date ko hi dikhao
        reason: leave.reason,
      }))
    );
  } catch (error) {
    console.error("Error fetching professors' leaves:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

// Announcement Schema
const announcementSchema = new mongoose.Schema({
  message: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});
const Announcement = mongoose.model("Announcement", announcementSchema);

app.get("/api/announcements", authenticate, async (_req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    // Log the fetched announcements to inspect the data
    console.log("Fetched announcements:", announcements);

    // Map the announcements with extra checks
    const mappedAnnouncements = announcements.map((ann) => {
      let authorName = "Unknown";
      if (ann.author && ann.author.name) {
        authorName = ann.author.name;
      }
      return {
        message: ann.message,
        authorName: authorName,
        createdAt: ann.createdAt,
      };
    });

    res.json(mappedAnnouncements);
  } catch (error) {
    // More detailed error logging
    console.error("Error in GET /api/announcements:", error.message);
    res.status(500).json({ error: "Server error while fetching announcements!" });
  }
});



// Post Announcement Endpoint (Only Professors can post)
app.post("/api/announcement", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "Professor") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { message } = req.body;
    const announcement = new Announcement({
      message,
      author: req.user.userId,
      createdAt: new Date(), // Ensure timestamp is saved
    });

    await announcement.save();
    res.json({ message: "Announcement posted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

// Set up multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save the file in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Get the file extension
    const fileName = `profile-${req.user.userId}${fileExtension}`; // Generate unique filename using userId
    cb(null, fileName); // Save the file with the new name
  },
});

const upload = multer({ storage: storage });

// Handle profile picture upload
// Handle profile picture upload
app.post(
  "/api/upload-profile-picture",
  authenticate,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      // Check if the file is provided
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Get the file path for the uploaded picture
      const filePath = `/uploads/${req.file.filename}`; // URL to access the uploaded file

      // Update the user document with the new profile picture path
      const updatedUser = await User.findByIdAndUpdate(
        req.user.userId,
        { profilePicture: filePath },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Send the updated profile picture URL in the response
      res.json({ profilePicture: filePath });
    } catch (error) {
      console.error("Error in profile picture upload:", error);
      res.status(500).json({ error: "Profile picture upload failed" });
    }
  }
);

// Password Change Endpoint
app.post("/api/change-password", authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log("reached");
    // Ensure oldPassword and newPassword are provided
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Both old and new passwords are required!" });
    }
    console.log("matching");

    const user=await User.findById(req.user.userId);

    // Check if the old password matches the stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect!" });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Save the updated user document
    await user.save();

    // Send success response
    res.json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
