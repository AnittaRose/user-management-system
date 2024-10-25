const successfunction = require('../util/responsehandler').successfunction;
const errorfunction = require('../util/responsehandler').errorfunction;
const users = require('../db/models/users')
// const user_type = require('../db/models/user_types');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();
let control_data=require('../util/controlldata.json')

exports.accessControl = async function (access_type, req, res, next){
    try {
        console.log("access_types", access_type);

        if(access_type === '*'){
            next();
        }else{

            const authHeader = req.headers["authorization"];
            console.log('authHeader',authHeader);

            if(!authHeader){
                let response = errorfunction({
                    statuscode: 400,
                    message: "please login to continue",
                });
                res.status(response.statuscode).send(response);
                return;
            }

            const token = authHeader.split(" ")[1];
            console.log('token',token);

            if(!token || token === "null" || token === "undefined"){
                let response = errorfunction({
                    statuscode:400,
                    message: "Invalid access token",
                });
                res.status(response.statuscode).send(response);
                return;
            }else{
                jwt.verify(token, process.env.PRIVATE_KEY, async function (err, decoded) {
                    if (err) {
                        let response = errorfunction({
                            statuscode: 400,
                            message: err.message ? err.message : "Authentication Failed",
                        });
                        res.status(response.statuscode).send(response);
                        return;
                    } else {
                        console.log("decoded :", decoded);
                
                        let user = await users.findOne({ _id :decoded.user_id}).populate('user_type')
                        console.log("user", user);

                        let user_type = user.user_type.user_type;
                        console.log("user_type", user_type);
                
                        let allowed = access_type.split(",").map((obj) => control_data[obj]);
                        console.log("allowed", allowed);
                
                        if (allowed && allowed.includes(user_type)) {
                            next();
                        } else {
                            let response = errorfunction({
                                statuscode: 400,
                                message: "Not allowed to access the route",
                            });
                            res.status(response.statuscode).send(response);
                            return;
                        }
                    }
                }); 
            }
        }
    } catch (error) {
        console.log("error",error);
    }
}
