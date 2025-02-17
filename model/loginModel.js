const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Use bcryptjs instead of bcrypt

const loginSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isPrimary: {
    type: Boolean,
  },
  otp: {
    type: String,
  },
});

// Use bcryptjs for password hashing
loginSchema.methods.hassPass = function (pass) {
  return bcrypt.hashSync(pass, bcrypt.genSaltSync(10));  // hashSync for bcryptjs
};

// Use bcryptjs for password comparison
loginSchema.methods.comPass = function (pass, hash) {
  return bcrypt.compareSync(pass, hash);  // compareSync for bcryptjs
};

module.exports = mongoose.model('Login', loginSchema);
