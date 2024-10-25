const user_type = require('../models/user_types')

'use strict';

module.exports = {
  up: (models, mongoose) => {
   
      return models.user_type.insertMany([
        {
         _id : "67029a691240a5ff40dd0dfe",
         user_type : "Admin"
        },
        {
          _id : "67029a891240a5ff40dd0e00",
          user_type : "Employee"
         }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
  
  },

  down: (models, mongoose) => {
  
      return models.user_type.deleteMany({
        _id:{
          $in : [
           "67029a691240a5ff40dd0dfe",
           "67029a891240a5ff40dd0e00"
          ]

        }
      }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
  
  }
};
