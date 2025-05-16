const mongoose = require('mongoose');
const restaurant = require('./restaurant');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
comments: {
    type: String,
    required: true,
},
rating: {
    type: Number,
    min: 1,
    max: 5
},
restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
},
user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);