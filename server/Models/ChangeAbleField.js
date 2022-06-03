const mongoose = require('mongoose');

const ChangeAbleFieldSchema = new mongoose.Schema({
    campaingName: {
        type: String,
        required: true
    },
    changeableField: {
        type: String,
        required: true
    },
    values: {
        type: Array,
    }
}, { timestamps: true });

module.exports = mongoose.model('ChangeAbleFiend', ChangeAbleFieldSchema)