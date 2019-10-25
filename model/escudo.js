const mongoose = require('../bin/mongodb')
const Schema = mongoose.Schema;

const escudoSchema = new Schema({
    tipo: String,
    valor: Array
})

module.exports = mongoose.model('escudos', escudoSchema)