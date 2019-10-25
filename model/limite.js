const mongoose = require('../bin/mongodb')
const Schema = mongoose.Schema;

const limiteSchema = new Schema({
    pais1: Number,
    pais2: Number
})

const Limite = mongoose.model('limites', limiteSchema)

module.exports = Limite