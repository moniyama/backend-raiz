const { Router } = require('express');
const router = Router();

const controller = require('../controller/HealthcheckController');

router.get('/ping', controller.ping);

module.exports = router;