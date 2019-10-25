var express = require('express')
var router = express.Router()

const grupo = require('../controllers/grupo')

router.get('/', function(req, res, next) {
  res.send('<h1>respond with a resource</h1>');
});

router.post('/grupo', grupo.save)
router.get('/grupo', grupo.getAll)
router.delete('/grupo', grupo.salir)
router.put('/grupo', grupo.unirse)
router.post('/jugar', grupo.iniciar)

module.exports = router
