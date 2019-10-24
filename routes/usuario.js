const express = require('express')
const router = express.Router()

const usuario = require('../controllers/usuario')

router.post("/", usuario.save)
router.post("/login", usuario.login)

module.exports = router