const express = require ('express');
const router = express.Router();
const usercontroller = require ('../controllers/usercontroller');
const accessControl = require('../util/accesscontrol').accessControl

function  setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next);
    }

}


router.post('/user',usercontroller.addusers);
router.get('/user', setAccessControl('1'),usercontroller.viewusers);
router.get('/users/:id', setAccessControl('*'),usercontroller.singleusers);
router.delete('/user/:id', setAccessControl('*'),usercontroller.deleteusers);
router.put('/user/:id', setAccessControl('*'),usercontroller.editusers)
router.put('/resetPassword/:id', setAccessControl('2'),usercontroller.updatePassword)
router.post('/forgot-password',setAccessControl('*') ,usercontroller.forgotPasswordController);
router.patch('/reset-password', setAccessControl('*'),usercontroller.passwordResetController);







module.exports = router