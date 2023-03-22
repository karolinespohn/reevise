var express = require('express');
var router = express.Router();
const db = require('./db')
const {register} = require('./register')
const {login} = require('./login')
const {home} = require('./home')
const {stack} = require('./stack')
const {edit} = require('./edit')
const {requireAuth} = require("./loginMiddleware");


router.get('/', function(req, res) {
  res.render('index', {
  })
});
router.get('/register', register)
router.post('/register', register)

router.get('/login', login)
router.post('/login', login)


router.get('/home', requireAuth, home)
router.post('/home', requireAuth, home)

router.get('/stack', requireAuth, stack)
router.post('/stack', requireAuth, stack)

router.get('/edit', requireAuth, stack)
router.post('/edit', requireAuth, stack)



module.exports = router;

