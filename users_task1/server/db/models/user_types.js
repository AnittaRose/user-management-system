const mongoose= require('mongoose')


let userSchema = new mongoose.Schema({
    user_type: {
        type : String
    }
})

let UserType = mongoose.model('user_type',userSchema)
module.exports = UserType;
