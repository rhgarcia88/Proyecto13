const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const currencies = require('../../utils/currencies.json');

const userSchema = new mongoose.Schema({
  email: { type: String, trim: true, required: true, unique: true },
  userName: { type: String, trim: true, required: true, unique: true },
  password: { type: String, trim: true, required: true },
  isPremium: { type: Boolean, default: false },
  premiumExpiresAt: { type: Date, default: null },
  currency: {type: String,enum: currencies.map(currency => currency.code), default: "USD"}
},{ 
  timestamps:true,
  collection:"users"
});

userSchema.pre("save", function() {
  this.password = bcrypt.hashSync(this.password, 10);
});


const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;