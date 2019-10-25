const mongoose = require('../bin/mongodb')
const Schema = mongoose.Schema;

const cartaGlobalSchema = new Schema({
    tipo: String,
    cantidad: Number,
    defensa: Number,
    ataque: Number,
    fronteraAbierta: Boolean,
    fronteraCerrada: Boolean,
    crisis: Boolean,
    refuerzosExtra: Boolean,
    color: String
})

module.exports = mongoose.model('cartaglobales', cartaGlobalSchema)