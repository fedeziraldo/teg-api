const mongoose = require('../bin/mongodb')
const Schema = mongoose.Schema;

const paisSchema = new mongoose.Schema({
    id: Number,
    nombre: String,
    archivo: String,
    posX: Number,
    posY: Number,
    continente:{ type: Schema.Types.ObjectId, ref: 'continentes' },
    escudo: { type: Schema.Types.ObjectId, ref: 'escudos' },
    limites: Array
})

paisSchema.methods.limita = function (pais) {
    return this.limites.indexOf(pais) != -1
}

paisSchema.methods.distancia = function (pais) {
    let distancia = 0
    if (this == pais) return distancia
    distancia++
    if (this.limita(pais)) return distancia
    distancia++
    for (let lim of this.limites) {
        if (lim.limites.indexOf(pais) != -1) return distancia
    }
    distancia++
    for (let lim of this.limites) {
        for (let limlim of lim.limites) {
            if (limlim.limites.indexOf(pais) != -1) return distancia
        }
    }
    throw ("muy lejos")
}

module.exports = mongoose.model('paises', paisSchema)