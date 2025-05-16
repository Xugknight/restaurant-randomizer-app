const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    cost: {
        type: String,
        enum: ['$', '$$', '$$$'],
        required: true,
    },
    description: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);