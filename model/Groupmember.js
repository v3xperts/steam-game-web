var mongoose = require('mongoose');
var Schema = mongoose.Schema;
OwnerSchema = require('../model/Owner.js');

var GroupmemberSchema = new Schema({
  	name: String,
  	user: { type: Schema.Types.ObjectId, ref: 'Owner' },
  	members : Array,
  	status: { type: Boolean, default: true },
  	created_at: { type: Date, default: Date.now },
  	updated_at: { type: Date, default: Date.now }
});

var Groupmember = mongoose.model('Groupmember', GroupmemberSchema);

module.exports = Groupmember;