const { model, Schema } = require('mongoose')

const chatMessageSchema = new Schema({
    name: String,
    message: String
}, { versionKey: false, timestamps: true })

module.exports = model('chatmessage', chatMessageSchema)