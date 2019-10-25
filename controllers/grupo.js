const grupos = {}
const jugadores = {}

module.exports = {
    save: async function (req, res, next) {
        try {
            if (grupos[req.body.userId]) return
            grupos[req.body.userId] = {nombre: req.body.userId, jugadores: [req.body.userId]}
            jugadores[req.body.userId] = req.body.userId
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
            if (!grupos[req.params.nombre]) return
            grupos[req.params.nombre].jugadores.add(req.body.userId)
            jugadores[req.body.userId] = req.params.nombre
            res.status(200).json( grupos )
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    salir: async function (req, res, next) {
        try {            
            delete jugadores[req.body.userId]
            grupos[jugadores[req.body.userId]].jugadores.splice(req.body.userId, 1)
            delete grupos[req.body.userId]
            res.status(200).json( grupos )
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    iniciar: async function (req, res, next) {
        try {
            if (!jugadores[req.body.userId] == req.body.userId) return
            res.status(200).json( "iniciando" )
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

}