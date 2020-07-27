const grupos = {}
const conectados = require("./conectados")

module.exports = {
    save: async function (req, res, next) {
        try {
            if (conectados[req.body.userId].grupo) throw("ya esta asignado a algun grupo")
            grupos[req.body.userId] = {nombre: req.body.userId, jugadores: [conectados[req.body.userId]]}
            conectados[req.body.userId].grupo = req.body.userId
            res.status(200).json( grupos )
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    getAll: async function (req, res, next) {
        try {
            res.status(200).json( grupos )
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    unirse: async function (req, res, next) {
        try {
            if (conectados[req.body.userId].grupo) throw("ya esta asignado a algun grupo")
            grupos[req.params.grupo].jugadores.add(conectados[req.body.userId])
            conectados[req.body.userId] = req.params.grupo
            res.status(200).json( grupos )
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    salir: async function (req, res, next) {
        try {
            if (grupos[req.body.userId].nombre == null) throw ("no puede salir")
            if (grupos[req.body.userId].nombre == conectados[req.body.userId].grupo){
                delete grupos[req.body.userId]
                for (let jugador of grupos[req.body.userId].jugadores) {
                    jugador.grupo = null
                }
            } else {
                grupos[req.body.userId].jugadores.splice(conectados[req.body.userId], 1)
                conectados[req.body.userId].grupo = null
            }
            res.status(200).json( grupos )
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    iniciar: async function (req, res, next) {
        try {
            if (grupos[req.body.userId] == null) throw("no tiene grupo")
            res.status(200).json( "iniciando" )
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

}