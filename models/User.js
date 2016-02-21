const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')

const UserSchema = new Schema({
  email: {type: String, unique: true},
  password: String
})
UserSchema.plugin(mongoosePaginate)

UserSchema.pre('save', next => {
  //if (!this.isModified('password')) return next()
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = (candidatePassword, cb) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) cb(err)
    cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
