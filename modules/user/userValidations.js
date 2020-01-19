const User = require("../../models/User");
const Validator = require("validator");
const isEmpty = require("../../utils/isEmpty");

async function validateRegisterInput(data) {
    let errors = {};

    data.fullName = !isEmpty(data.fullName) ? data.fullName : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (Validator.isEmpty(data.fullName)) {
        errors.fullName = "fullName field is required";
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    let user = await User.findOne({
        email: data.email
    });

    if (!isEmpty(user)) {
        errors.msg = "User already exist";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

async function validateSigninInputs(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (
        isEmpty(
            await User.findOne({
                email: data.email
            })
        )
    ) {
        errors.msg = "User Not Found";
    }

    if (!(await bcrypt.compare(password, user.password))) {
        errors.msg = "Either the email or the password is wrong";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

module.exports = {
    validateRegisterInput,
    validateSigninInputs
};
