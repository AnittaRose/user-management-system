const users = require ('../db/models/users')
const { successfunction, errorfunction } = require('../util/responsehandler')
const bcrypt = require ('bcrypt')
const user = require('../db/models/user_types')
const send =require("../util/send-emails").sendEmail;
const resetpassword=require('../util/emailtemplates/set-password').resetPassword
const resetpasswords= require('../util/emailtemplates/resetpassword').resetPassword
const fileUpload = require('../util/uploads').fileUpload;
const jwt = require('jsonwebtoken')

exports.addusers = async function (req, res) {
  try {
      let body = req.body;
      console.log('body', body);

      let name = body.name;
      let emails = body.email;
      let image = body.image;

      // Find the user type
      let user_type = await user.findOne({ user_type: body.user_type });
      console.log("user type", user_type);

      if (!user_type) {
          return res.status(400).send({
              success: false,
              message: "User type not found."
          });
      }

      let id = user_type._id;
      console.log(id);
      body.user_type = id;

      // Handle image upload
      if (image) {
          let image_path = await fileUpload(image, "users");
          console.log("image_path", image_path);
          body.image = image_path;
      }

      // Generate a random password
      function generateRandomPassword(length) {
          let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
          let password = "";
          for (var i = 0; i < length; i++) {
              var randomIndex = Math.floor(Math.random() * charset.length);
              password += charset.charAt(randomIndex);
          }
          return password;
      }

      var randomPassword = generateRandomPassword(12);
      console.log(randomPassword);

      // Check if the user already exists
      let count = await users.countDocuments({ email: emails });
      console.log("count : ", count);

      if (count > 0) {
          let response = errorfunction({
              statusCode: 400,
              message: "User already exists",
          });

          res.status(response.statuscode).send(response);
          return;
      }

      // Send the reset password email
      let content = await resetpassword(name, emails, randomPassword);
      await send(emails, "update password", content);

      // Hash the password
      let salt = bcrypt.genSaltSync(10);
      let password = bcrypt.hashSync(randomPassword, salt);
      console.log("password : ", password);

      // Prepare user data
      let randomData = {
          username: body.username,
          email: body.email,
          user_type: body.user_type,
          password: password,
          image: body.image
      };

      // Create the new user
      let view = await users.create(randomData);
      console.log('view', view);

      let response = successfunction({
          success: true,
          statusCode: 200,
          message: "User Added Successfully",
          data: view
      });
      res.status(response.statuscode).send(response);
      return;

  } catch (error) {
      console.log("error : ", error);
      let response = errorfunction({
          success: false,
          statusCode: 400,
          message: "An error occurred"
      });
      res.status(response.statuscode).send(response);
      return;
  }
};


exports.viewusers = async function (req,res){
    try {
        let sections = await users.find({user_type : {$ne:'67029a691240a5ff40dd0dfe'}});
        console.log('sections',sections)
        // let strsection = JSON.stringify(sections);
 
        let response = successfunction({
            success: true,
            statuscode: 200,
            message: "Admin Added Successfully",
            data:sections
            
        })
        res.status(response.statuscode).send(response)
        return;

    } catch (error) {

        console.log("error : ", error);
        let response = errorfunction({
            success: false,
            statuscode: 400,
            message: "error"
            
        })
        res.status(response.statuscode).send(response)
        return;
    }
};

exports.singleusers = async function(req,res){

   try {
    let single_id = req.params.id;
    console.log('id from single',single_id);

    let one_data = await users.findOne({_id: single_id}).populate('user_type')
    console.log('one_data',one_data);

    let response = successfunction({
        success: true,
        statuscode: 200,
        message: "single view success",
        data:one_data
        
    })
    res.status(response.statuscode).send(response)
    return;

   } catch (error) {
    console.log("error",error);

    let response = errorfunction({
        success: false,
        statuscode: 400,
        message: "error"
        
    })
    res.status(response.statuscode).send(response)
    return;

   }   
};

exports.deleteusers = async function(req,res){
    try {
        let delete_id =req.params.id;
        console.log('delete_id',delete_id);

        let delete_onedata = await users.deleteOne({_id : delete_id});
        res.status(200).send(delete_onedata)
    } catch (error) {
        console.log('error',error)
    }
}

exports.editusers = async function(req,res){
    try {
        let body = req.body;
        console.log('body',body);

        
        let data= {
            username : body.username,
            email : body.email,
            password : body.password,
            usertype : body.user_type
        }


        let id = req.params.id;

        let updatedata = await users.updateOne({ _id : id }, { $set: data });
        console.log('updatedata',updatedata);

        let strupdatedata = JSON.stringify(updatedata);
        console.log('strupdatedata',strupdatedata)

        let response = successfunction({
            success: true,
            statuscode: 200,
            message: " updated Successfully",
            data:updatedata
            
        })
        res.status(response.statuscode).send(response)
        return;



    } catch (error) {

        console.log("error : ", error);
        let response = errorfunction({
            success: false,
            statuscode: 400,
            message: "error"
            
        })
        res.status(response.statuscode).send(response)
        return;
    }
};

exports.updatePassword = async function (req,res){
    try {
        let  _id = req.params.id
        console.log(_id);
    
        let user = await users.findOne({_id : _id})
        console.log("user :",user);
    
        // let passwordMatch =  bcrypt.compareSync(req.body.password,user.password);
        // console.log("passwordMatch",passwordMatch);
    
        const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
        console.log("passwordMatch: ", passwordMatch);

        if(passwordMatch){
            let newpassword = req.body.newpassword;

            let salt = bcrypt.genSaltSync(10);
            let hashed_password = await bcrypt.hash(newpassword,salt);

            console.log("hashed_password",hashed_password)


            req.body.password=hashed_password
            console.log("new password",req.body.password)



            let updatePassword = await users.updateOne({_id},{$set:{password : req.body.password}});
            console.log(updatePassword)

            
            let response = successfunction({
                success: true,
                statuscode: 200,
                data :updatePassword,
                message: "successfully reset...."
            })
            res.status(response.statuscode).send(response)
            return;


        }

    } catch (error) {
        console.log("error : ", error);
        let response = errorfunction({
            success: false,
            statuscode: 400,
            message: "error"
        })
        res.status(response.statuscode).send(response)
        return;
    } 
};


// exports.updatePassword = async function (req, res) {
//     try {
//         let currentData = req.body.password;
//         let newPassword = req.body.newPassword; // Assuming new password is passed in the body
//         let _id = req.params.id;
//         console.log("User ID:", _id);

//         let user = await users.findOne({ _id: _id });
//         if (!user) {
//             return res.status(404).send("User not found");
//         }
//         console.log("User:", user);

//         const passwordMatch = bcrypt.compareSync(currentData, user.password);
//         console.log("Password match:", passwordMatch);

//         if (!passwordMatch) {
//             return res.status(401).send("Current password is incorrect");
//         }

//         // Logic to update the password
//         user.password = bcrypt.hashSync(newPassword, 10); // Hash the new password
//         await user.save(); // Save the updated user

//         res.status(200).send("Password updated successfully");
//     } catch (error) {
//         console.log("Error:", error);
//         res.status(500).send("Internal server error");
//     }
// };

exports.forgotPasswordController = async function (req, res) {
    try {
      let email = req.body.email;
  
      if (email) {
        let user = await users.findOne({ email: email });
        if (user) {
          let reset_token = jwt.sign(
            { user_id: user._id },
            process.env.PRIVATE_KEY,
            { expiresIn: "10m" }
          );
          let data = await users.updateOne(
            { email: email },
            { $set: { password_token: reset_token } }
          );
          console.log("data",data)
          if (data.matchedCount === 1 && data.modifiedCount == 1) {
            let reset_link = `${process.env.FRONTEND_URL}?token=${reset_token}`;
            let email_template = await resetpasswords(user.first_name, reset_link);
            send(email, "Forgot password", email_template);
            let response = successfunction({
              statuscode: 200,
              data:reset_token,
              message: "Email sent successfully",
            });
            res.status(response.statuscode).send(response);
            return;
          } else if (data.matchedCount === 0) {
            let response = errorfunction({
              statuscode: 404,
              message: "User not found",
            });
            res.status(response.statuscode).send(response);
            return;
          } else {
            let response = errorfunction({
              statuscode: 400,
              message: "Password reset failed",
            });
            res.status(response.statuscode).send(response);
            return;
          }
        } else {
          let response = errorfunction({ statuscode: 400, message: "Forbidden" });
          res.status(response.statuscode).send(response);
          return;
        }
      } else {
        let response = errorfunction({
          statuscode: 400,
          message: "Email is required",
        });
        res.status(response.statuscode).send(response);
        return;
      }
    } catch (error) {
        console.log("error : ", error);
        let response = errorfunction({
            success: false,
            statuscode: 400,
            message: "error"
        })
        res.status(response.statuscode).send(response)
        return;
    } 
};

exports.passwordResetController = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    console.log("authheadeer",authHeader)
    const token = authHeader.split(" ")[1];
    console.log("token",token);

    let password = req.body.password;
    console.log("password :",password);



    decoded = jwt.decode(token);
    console.log("decoded : ",decoded);

    let user = await users.findOne({
      $and: [{ _id: decoded.user_id }, { password_token: token }],
    });
    console.log("user",user)
    if (user) {
      let salt = bcrypt.genSaltSync(10);
      let password_hash = bcrypt.hashSync(password, salt);
      let data = await users.updateOne(
        { _id: decoded.user_id },
        { $set: { password: password_hash, password_token: null } }
      );
      if (data.matchedCount === 1 && data.modifiedCount == 1) {
        let response = successfunction({
          status: 200,
          message: "Password changed successfully",
        });
        res.status(response.statuscode).send(response);
        return;
      } else if (data.matchedCount === 0) {
        let response = errorfunction({
          status: 404,
          message: "User not found",
        });
        res.status(response.statuscode).send(response);
        return;
      } else {
        let response = errorfunction({
          status: 400,
          message: "Password reset failed",
        });
        res.status(response.statuscode).send(response);
        return;
      }
    }else{
      let response = errorfunction({ status: 403, message: "Forbidden" });
    res.status(response.statuscode).send(response);
    return;
    }

    
  }  catch (error) {
    console.log("error : ", error);
    let response = errorfunction({
        success: false,
        statuscode: 400,
        message: "error"
    })
    res.status(response.statuscode).send(response)
    return;
  }
};
