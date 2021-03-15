const express = require("express");
const { getHomePage, getDashboard } = require("../controllers");

const router = express.Router();

const isAuth = require("../middleware/auth");

// HOME PAGE
router.get("/", getHomePage);

// DASHBOARD
router.get("/dashboard", isAuth, getDashboard);

module.exports = router;
