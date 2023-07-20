const mongoose = require('mongoose')
const slug = require('slug')
const { Schema } = mongoose

const devicesSchema = new Schema({
    nome: { type: String},
    slug: { type: String, required: true, unique: true, default: function(){ return slug(this.nome)}},
    umidade: { type: String}, 
    motorStatus: { type: Boolean},
})

module.exports = mongoose.model('devices', devicesSchema)