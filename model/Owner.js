// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// create a schema
var OwnerSchema = new Schema({
  firstname: String,
  lastname: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: true },
  steamCheck: { type: Boolean, default: false },
  steamData: Schema.Types.Mixed,
  created_at: Date,
  updated_at: Date
});

OwnerSchema.plugin(passportLocalMongoose);
// the schema is useless so far
// we need to create a model using it
var Owner = mongoose.model('Owner', OwnerSchema);

// make this available to our users in our Node applications
module.exports = Owner;