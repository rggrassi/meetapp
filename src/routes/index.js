const router = require('express').Router();
const multer = require('multer');
const multerConfig = require('../config/multer');
const { User, File, Meetup, Subscription } = require('../database');
const UserController = require('../controllers/UserController');
const SessionController = require('../controllers/SessionController');
const FileController = require('../controllers/FileController')
const MeetupController = require('../controllers/MeetupController');
const SubscriptionController = require('../controllers/SubscriptionController');
const auth = require('../middlewares/auth');

router.post('/users', UserController.store.bind(null, User));
router.post('/session', SessionController.create.bind(null, User));

router.use(auth);

router.put('/users', UserController.update.bind(null, User));

router.post('/meetups', MeetupController.create.bind(null, Meetup));
router.get('/meetups', MeetupController.index.bind(null, { Meetup, User }));
router.put('/meetups/:id', MeetupController.update.bind(null, Meetup));
router.delete('/meetups/:id', MeetupController.remove.bind(null, Meetup));

router.post('/subscriptions/:meetupId', SubscriptionController.create.bind(null, { Meetup, Subscription }));

router.post('/files', multer(multerConfig).single('file'), FileController.store.bind(null, File));

module.exports = router;