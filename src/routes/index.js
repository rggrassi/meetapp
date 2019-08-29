const { User } = require('../database');
const router = require('express').Router();
const UserController = require('../controllers/UserController');
const SessionController = require('../controllers/SessionController')

router.post('/users', UserController.store.bind(null, User));
router.post('/session', SessionController.create.bind(null, User));

module.exports = router;