var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var PageSchema = new Schema({
  title: String,
  description: String,
  status: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// the schema is useless so far
// we need to create a model using it
var Page = mongoose.model('Page', PageSchema);

// make this available to our users in our Node applications
module.exports = Page;