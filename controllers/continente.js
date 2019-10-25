const continente = require("../model/continente")

module.exports = {
    save: async function (req, res, next) {
        try {
            const cont = new continente({
            })
            res.status(200).json({ continente: await cont.save() })
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    getAll: async function (req, res, next) {
        try {
            res.status(200).json({ continentes: await continente.find() });
        } catch (e) {
            console.log(e)
            next(e);
        }
    },

    update: async function (req, res, next) {
        try {
            const cont = await continente.findOneAndUpdate({ id: req.params.id }, {
                $set: {
                }
            })
            res.status(200).json({ continente: await cont.save() })
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    get: async function (req, res, next) {
        try {
            res.status(200).json({ continente: await continente.findOne({ id: req.params.id }) })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}