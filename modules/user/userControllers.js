const logger = require("../../utils/logger");

const { sendResponse, handleCustomError } = require("../../utils/index");
const {
    createNewUser,
    signInUser,
    registerWithGoogle,
    loginWithGoogle
} = require("./userServices");

const {
    validateRegisterInput,
    validateSigninInputs
} = require("./userValidations");

// Controller for creating a new user
async function createNewUserController(req, res) {
    let data;
    try {
        switch (req.body.authType) {
            case "local":
                const { errors, isValid } = await validateRegisterInput(
                    req.body
                );
                if (!isValid) {
                    return sendResponse(res, 422, errors);
                }

                const { email, fullName, password, authType } = req.body;

                data = await createNewUser({
                    email,
                    fullName,
                    password,
                    authType
                });
                break;

            case "google":
                data = await registerWithGoogle(req.body);
                break;
            case undefined:
                const msg = "authType is required";
                const err = new Error(msg);
                err.code = 400;
                err.msg = msg;
                throw err;
        }

        return sendResponse(
            res,
            201,
            {
                ...data
            },
            "Request Successful"
        );
    } catch (err) {
        logger.error("Error For Debugging  ====>  ", err);
        return handleCustomError(res, err);
    }
}

//Controller for signing in
async function signInUserController(req, res) {
    let data;

    try {
        switch (req.body.authType) {
            case "local":
                const { errors, isValid } = await validateSigninInputs(
                    req.body
                );
                if (!isValid) {
                    return sendResponse(res, 422, errors);
                }
                const { email, password, authType } = req.body;

                data = await signInUser({
                    email,
                    password,
                    authType
                });
                break;
            case "google":
                data = await loginWithGoogle(req.body);
                break;
            case undefined:
                const msg = "authType is required";
                const err = new Error(msg);
                err.code = 400;
                err.msg = msg;
                throw err;
        }

        return sendResponse(
            res,
            201,
            {
                ...data
            },
            "Request Successful"
        );
    } catch (err) {
        logger.error("Error For Debugging  ====>  ", err);
        return handleCustomError(res, err);
    }
}

module.exports = {
    createNewUserController,
    signInUserController
};
