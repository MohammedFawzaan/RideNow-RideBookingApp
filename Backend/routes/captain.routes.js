const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../controllers/captain.controller");

router.post("/register", [
    body("fullname.firstname").notEmpty().withMessage("First name is required"),
    body("fullname.lastname").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
    body("vehicle.color").notEmpty().withMessage("Color is required"),
    body("vehicle.plate").notEmpty().withMessage("Plate is required"),
    body("vehicle.capacity").isNumeric().withMessage("Capacity must be a number"),
    body("vehicle.vehicleType").notEmpty().withMessage("Vehicle type is required")
], userController.registerCaptain);


module.exports = router;