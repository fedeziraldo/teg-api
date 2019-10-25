const pais = require("../model/pais")

module.exports = {
    save: async function (req, res, next) {
        try {
            const pa = new pais({
            })
            res.status(200).json({ pais: await pa.save() })
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    getAll: async function (req, res, next) {
        try {
            res.status(200).json({ paises: await pais.find() });
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    update: async function (req, res, next) {
        try {
            const pa = await pais.findOneAndUpdate({ id: req.params.id }, {
                $set: {
                }
            })
            res.status(200).json({ pais: await pa.save() })
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    get: async function (req, res, next) {
        try {
            res.status(200).json({ pais: await pais.findOne({ id: req.params.id }) })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}