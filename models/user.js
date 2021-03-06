let bcrypt = require('bcryptjs')
let mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 1
  },
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    },
    password:{
      type: String,
      required: true,
      minlength: 8,
      maxlength: 32
    },
})

//Use bcrypt to hash password
userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, 12)
  next()
})

//Ensure that password doesn't get sent with the res of the data
userSchema.set('toJSON', {
  transform: (doc, user) => {
    delete user.paassword
    return user
  }
})

//Create a helper funtion to compare the paassword hashes
userSchema.methods.isAuthenticated = function(typedPassword) {
  return bcrypt.compareSync(typedPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
