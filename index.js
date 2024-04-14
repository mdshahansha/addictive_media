const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const useragent = require("express-useragent");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
// const corsOptions = {
//
// };
app.use(cors());
// Middleware
app.use(useragent.express());
// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://trans:trans@cluster0.3gzaffk.mongodb.net/assI",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB ...");
});

// Define user schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phonenumber: String,
  email: String,
  dob: Date,
  ipAddress: String,
  deviceType: String,
  browser: String,
  userAgent: String,
  addresses: Array,
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files like HTML, CSS, etc.

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", async (req, res) => {
  const { firstName, lastName, phonenumber, email, addresses } = req.body;

  // Concatenate the strings into a single string in the format "YYYY-MM-DD"
  let { day, month, year } = req.body;
  // Convert day, month, and year to numbers
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  // Create a Date object
  const dob = new Date(yearNum, monthNum - 1, dayNum);

  console.log(req.body);
  // Server-side validation
//   if (!firstName || !lastName || !phonenumber || !email || !dob) {
//     return res.status(400).send("All fields are mandatory.");
//   }

//   // Type validation for Phone Number
//   if (!/^\d{10}$/.test(phonenumber)) {
//     return res.status(400).send("Please enter a valid 10-digit phone number.");
//   }

//   // Type validation for Email Address
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     return res.status(400).send("Please enter a valid email address.");
//   }

//   // Duplicate checking for Phone Number
//   const existingPhoneNumber = await User.findOne({ phonenumber });
//   if (existingPhoneNumber) {
//     return res.status(400).send("Phone number already exists.");
//   }

//   // Duplicate checking for Email Address
//   const existingEmail = await User.findOne({ email });
//   if (existingEmail) {
//     return res.status(400).send("Email address already exists.");
//   }

  // Save user details into the database
  const newUser = new User({
    firstName,
    lastName,
    phonenumber,
    email,
    dob,
    addresses,
    ipAddress: req.ip,
    ipAddress: req.ip,
    deviceType: req.useragent.isMobile ? "Mobile" : "Desktop", // Determine device type
    browser: req.useragent.browser, // Get browser name from user-agent
    userAgent: req.headers["user-agent"], // Save the full user-agent string
  });
  console.log(newUser);
  await newUser.save();
  res.status(201).send("User details saved successfully.");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
