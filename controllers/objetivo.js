const objetivo = require("../model/objetivo")

module.exports = {
    getAll: async function (req, res, next) {
        try {
            res.status(200).json({ objetivos: await objetivo.find() });
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    get: async function (req, res, next) {
        try {
            res.status(200).json({ objetivo: await objetivo.findOne({ id: req.params.id }) })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}