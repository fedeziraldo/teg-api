const limite = require("../model/limite")

module.exports = {
    save: async function (req, res, next) {
        try {
            const lim = new pais({
            })
            res.status(200).json({ limite: await lim.save() })
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    getAll: async function (req, res, next) {
        try {
            res.status(200).json({ limites: await limite.find() });
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    update: async function (req, res, next) {
        try {
            const lim = await limite.findOneAndUpdate({ pais1: req.params.id1, pais2: req.params,id2 }, {
                $set: {
                }
            })
            res.status(200).json({ limite: await lim.save() })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}