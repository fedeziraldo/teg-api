const escudo = require("../model/escudo")

module.exports = {
    save: async function (req, res, next) {
        try {
            const esc = new escudo({
            })
            res.status(200).json({ escudo: await escudo.save() })
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    getAll: async function (req, res, next) {
        try {
            res.status(200).json({ escudos: await escudo.find() });
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    update: async function (req, res, next) {
        try {
            const esc = await escudo.findOneAndUpdate({ tipo: req.params.tipo }, {
                $set: {
                }
            })
            res.status(200).json({ escudo: await esc.save() })
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    get: async function (req, res, next) {
        try {
            res.status(200).json({ escudo: await escudo.findOne({ tipo: req.params.tipo }) })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}