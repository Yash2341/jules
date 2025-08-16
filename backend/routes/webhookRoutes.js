const express = require('express');
const router = express.Router();
const { handleUpdate } = require('../controllers/webhookController');

router.post('/:botId', handleUpdate);

module.exports = router;
