const mongoose = require('../bin/mongodb')
const Schema = mongoose.Schema;

const continenteSchema = new Schema({
    id: Number,
    nombre: String,
    fichas: Number,
    escudo: { type: Schema.Types.ObjectId, ref: 'escudos' }
})

module.exports = mongoose.model('continentes', continenteSchema)