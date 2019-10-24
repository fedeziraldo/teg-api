const mongoose = require('../bin/mongodb')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const UsuarioSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: [true, "El email es obligatorio"],
        unique: true
    },
    contrasena: {
        type: String,
        trim: true,
        required: [true, "El password es obligatorio"],
        minlength: [4, "El password debe tener al menos 4 caracteres"],
        maxlength: [8, "El password debe tener como máximo 8 caracteres"]
    },
    nombreCompleto: {
        type: String,
        trim: true
    },
    activo: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    fecha: {
        type: Date,
        default: new Date()
    }
});

UsuarioSchema.pre('save', function(next){
    this.contrasena = bcrypt.hashSync(this.contrasena, 10)
    next()
})

module.exports = mongoose.model('usuarios', UsuarioSchema)