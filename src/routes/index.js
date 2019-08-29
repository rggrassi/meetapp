const { User } = require('../database');
const router = require('express').Router();
const UserController = require('../controllers/UserController');
const SessionController = require('../controllers/SessionController')
const auth = require('../middlewares/auth')

router.post('/users', UserController.store.bind(null, User));
router.post('/session', SessionController.create.bind(null, User));

router.use(auth);

router.put('/users', UserController.update.bind(null, User));

module.exports = router;