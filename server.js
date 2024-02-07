// mongoDBpasskey = "Zh6XOOx5sgLHNpfj"

const express = require("express");
const mongoose = require("mongoose");
const Registeruser = require("./model");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware");
const cors = require("cors");

const app = express();

mongoose
  .connect(
    "mongodb+srv://jeereddybhargav:Zh6XOOx5sgLHNpfj@test1.o2eanfy.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database Connected");
  });

// Middleware
app.use(express.json());
app.use(cors({origin : "*"}))


// Home Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Register Route post request
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmpassword } = req.body;
    let exists = await Registeruser.findOne({ email: email });
    if (exists) {
      return res.status(400).send("User Already Exists");
    } else {
      if (password !== confirmpassword) {
        return res.status(400).send("Password Not Matching");
      } else {
        let newuser = new Registeruser({
          username,
          email,
          password,
          confirmpassword,
        });
        await newuser.save();
        res.status(200).send("Registered successfully");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let exists = await Registeruser.findOne({ email: email });
    if (!exists) {
      return res.status(400).send("EmailID not registered");
    }

    if (exists.password !== password) {
      return res.status(400).send("Incorrect Password");
    }

    // JWT Token

    let payload = {
      user: {
        id: exists.id,
      },
    };

    jwt.sign(payload, "jwtSecret", { expiresIn: 3600000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Error");
  }
});

// Protected Route Myprofile Route
app.get("/myprofile", middleware, async (req, res) => {
  try {
    let exists = await Registeruser.findById(req.user.id);

    if (!exists) {
      return res.status(400).send("user not found");
    }

    res.json(exists);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(5000, () => {
  console.log("server is running...");
});
