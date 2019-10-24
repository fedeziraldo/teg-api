const express = require('express')
const router = express.Router()

const usuario = require('../controllers/usuario')

router.get("/", usuario.getAll)
router.put("/", usuario.update)
router.get("/:email", usuario.get)

module.exports = router