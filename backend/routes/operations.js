const express = require('express');

const operationsController = require('../controllers/operations');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/operations', isAuth, operationsController.getOperations);

router.get('/schedule', operationsController.schedule);

module.exports = router;