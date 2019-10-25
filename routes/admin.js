const express = require('express')
const router = express.Router()

const usuario = require('../controllers/usuario')
const pais = require('../controllers/pais')
const continente = require('../controllers/continente')
const limite = require('../controllers/limite')
const escudo = require('../controllers/escudo')

router.get("/", usuario.getAll)
router.put("/:email", usuario.update)
router.get("/:email", usuario.get)
router.get("/login", usuario.saveAdmin)

router.get("/", pais.getAll)
router.put("/:id", pais.update)
router.get("/:id", pais.get)
router.post("/", pais.save)

router.get("/", continente.getAll)
router.put("/:id", continente.update)
router.get("/:id", continente.get)
router.post("/", continente.save)

router.get("/", limite.getAll)
router.put("/:id1-:id2", limite.update)
router.post("/", limite.save)

router.get("/", escudo.getAll)
router.put("/:tipo", escudo.update)
router.get("/:tipo", escudo.get)
router.post("/", escudo.save)

module.exports = router