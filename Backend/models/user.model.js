const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// userSchema(structure) for user model
const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minLength: [3, 'First Name must be at least 3 character'],
        },
        lastname: {
            type: String,
            minLength: [5, 'First Name must be at least 5 character'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: [5, 'First Name must be at least 5 character'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    }
});

// using methods creating 3 functions (generateAuthToken, comparePassword, hashPassword)
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    return token;
};

userSchema.methods.comparePassword = async function(password) {
    // to verify password compare it with user's password
    return await bcrypt.compare(password, this.password);
}

// static method to hash to given Password
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

// create model and export it
const userModel = mongoose.model('user', userSchema);
module.exports = userModel;