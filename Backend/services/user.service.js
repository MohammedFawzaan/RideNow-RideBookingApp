const userModel = require('../models/user.model');

// A service - function to create a User
module.exports.createUser = async({ firstname, lastname, email, password }) => {
    // checking if all fields are provided
    if(!firstname || !email || !password) {
        throw new Error('All Fields Requried');
    }
    // Creating a user
    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    });
    return user;
};