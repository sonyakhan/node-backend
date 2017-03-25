// BEAR.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PeopleSchema = new Schema({
    name: String,
    city: String
});

module.exports = mongoose.model('People', PeopleSchema);
