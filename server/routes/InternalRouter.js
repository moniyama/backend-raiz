const { Router } = require('express');
const router = Router();

const controller = require('../controller/InternalController');
const internalAuthentication = require('../middlewares/internal');

router.use(internalAuthentication);

router.get('/reset', controller.list);
router.delete('/reset', controller.reset);

module.exports = router;