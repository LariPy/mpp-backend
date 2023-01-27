const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    itemname: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Item', itemSchema)