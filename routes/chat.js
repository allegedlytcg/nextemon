const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

const auth = require("../middleware/auth");


router.get("/", async (req, res) => {
  const token = req.header("authorization");

  if (!token) {
    console.log("token not coming through");
    return res.status(401).json({ message: "no token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const io = req.app.get("io");
    req.user = decoded.user;
    id = req.user.id;

    let user = await User.findOne({ _id: id });
    io.on("connect", (socket) => {
      console.log(user.name);
      socket.emit('user', user.name);

    })

    res.status(200).json({message: "you did it!"});
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "token not valid" });
  }
});

module.exports = router;
