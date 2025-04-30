const express = require('express');
const router = express.Router();
const { body } = require('express-validator'); //express-validator for validating user model
const userController = require('../controllers/user.controller');

// post request for register route - validate middleware from express-validator, controller logic
router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be of 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('password must be atleast 6 characters')
],userController.registerUser);

// post request for login route - validate middleware from express-validator, controller logic
router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('password must be atleast 6 characters')
],userController.loginUser);

module.exports = router;