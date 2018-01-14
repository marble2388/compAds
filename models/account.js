var mongoose = require('mongoose');
//this tells the app this model is for account management
var plm = require('passport-local-mongoose')


//create the schema oh god please work not again
var accountSchema = new mongoose.Schema({});

//enable plm on model
accountSchema.plugin(plm);

//make the model public
module.exports = mongoose.model('Account', accountSchema );