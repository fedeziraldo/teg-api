const usuario = require("../model/usuario")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

async function usuarioRoot() {
    try {
        if (await usuario.findOne({ email: "root" })) return
        const usu = await new usuario({
            nombreCompleto: "root",
            email: "root",
            contrasena: "root",
            activo: true,
            admin: true
        })
        console.log(await usu.save())
    } catch (e) {
        console.log(e)
    }
}
usuarioRoot()

module.exports = {
    save: async function (req, res, next) {
        try {
            const usu = new usuario({
                nombreCompleto: req.body.nombreCompleto,
                email: req.body.email,
                contrasena: req.body.contrasena,
            })
            const result = await usu.save()
            res.status(200).json({ usuario: result })
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    saveAdmin: async function (req, res, next) {
        try {
            const usu = new usuario({
                nombreCompleto: req.body.nombreCompleto,
                email: req.body.email,
                contrasena: req.body.contrasena,
                admin: true
            })
            const result = await usu.save()
            res.status(200).json({ usuario: result })
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    login: async function (req, res, next) {
        try {
            const usu = await usuario.findOne({ email: req.body.email });
            if (usu) {
                if (bcrypt.compareSync(req.body.contrasena, usu.contrasena)) {
                    const token = jwt.sign({ id: usu._id }, req.app.get('secretKey'), { expiresIn: '1h' });
                    console.log(token, usu)
                    res.status(200).json({ status: "success", message: "user found!!!", data: { user: usu, token: token } });
                } else {
                    res.status(400).json({ status: "error", message: "Invalid user/password!!!", data: null });
                }
            } else {
                res.status(400).json({ status: "not_found", message: "user not found!!!", data: null })
            }
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    getAll: async function (req, res, next) {
        try {
            var usus = await usuario.find()
            res.status(200).json({ usuarios: usus });
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    update: async function (req, res, next) {
        try {
            const usu = await usuario.findOneAndUpdate({ email: req.params.email }, {
                $set: {
                    nombreCompleto: req.body.nombreCompleto,
                    admin: req.body.admin,
                    activo: req.body.activo
                }
            })
            res.status(200).json({ usuario: usu })
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

    get: async function (req, res, next) {
        try {
            const usu = await usuario.findOne({ email: req.params.email })
            res.status(200).json({ usuario: usu })
        } catch (e) {
            console.log(e)
            next(e)
        }
    },

}