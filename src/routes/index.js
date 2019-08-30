const router = require('express').Router();
const multer = require('multer');
const multerConfig = require('../config/multer');
const { User, File } = require('../database');
const UserController = require('../controllers/UserController');
const SessionController = require('../controllers/SessionController')
const FileController = require('../controllers/FileController')
const auth = require('../middlewares/auth')

router.post('/users', UserController.store.bind(null, User));
router.post('/session', SessionController.create.bind(null, User));

router.use(auth);

router.put('/users', UserController.update.bind(null, User));

router.post('/files', multer(multerConfig).single('file'), FileController.store.bind(null, File));

module.exports = router;