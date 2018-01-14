//requirements
const mongoose = require('mongoose');
//make the ad schema
var adSchema = mongoose.Schema({
    Title: {
        type: String,
        required:'Title is Required'
    },
    Description: {
        type: String,
        required:'Desc is Required'
    },
    Price: {
        type: Number,
        required:'Price is Required'
    }
});
//make public if working
module.exports = mongoose.model('Ad', adSchema);