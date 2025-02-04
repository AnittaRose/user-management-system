// const successfunction = require('../util/')
const users = require ('../db/models/Employe')
const { successfunction, errorfunction } = require('../util/responsehandler')
const bcrypt = require ('bcrypt')
const jwt =require('jsonwebtoken')

exports.login = async function (req, res) {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;
        console.log('email:', email);
        console.log('password:', password);

        // Validate input
        if (!email || !password) {
            let response = errorfunction({
                success: false,
                statuscode: 400,
                message: "Email and password are required.",
            });
            return res.status(response.statuscode).send(response);
        }

        // Fetch user from the database
        const view = await users.findOne({ email }).populate("user_type");
        console.log('view:', view);

        if (!view) {
            let response = errorfunction({
                success: false,
                statuscode: 404,
                message: "User not found.",
            });
            return res.status(response.statuscode).send(response);
        }

        // Validate password
        const isPasswordMatch = bcrypt.compareSync(password, view.password || "");
        console.log("Password match:", isPasswordMatch);

        if (!isPasswordMatch) {
            let response = errorfunction({
                success: false,
                statuscode: 400,
                message: "Invalid password.",
            });
            return res.status(response.statuscode).send(response);
        }

        // Generate JWT token
        const token = jwt.sign({ user_id: view._id }, process.env.PRIVATE_KEY, { expiresIn: "10d" });
        console.log('token:', token);

        // Ensure `user_type` exists
        if (!view.user_type || !view.user_type.user_type) {
            let response = errorfunction({
                success: false,
                statuscode: 500,
                message: "User type is missing or invalid.",
            });
            return res.status(response.statuscode).send(response);
        }

        // Build token data
        const token_data = {
            token,
            id: view._id,
            user_type: view.user_type.user_type,
        };
        console.log("Token Data:", token_data);

        // Success response
        let response = successfunction({
            success: true,
            statuscode: 200,
            data: token_data,
            message: "Login successfully.",
        });
        return res.status(response.statuscode).send(response);

    } catch (error) {
        console.error('Login error:', error);

        let response = errorfunction({
            success: false,
            statuscode: 500,
            message: "Internal Server Error.",
        });
        return res.status(response.statuscode).send(response);
    }
};
