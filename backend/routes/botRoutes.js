const express = require('express');
const router = express.Router();
const { addBot, getBots, deleteBot } = require('../controllers/botController');
const {
  addCommand,
  updateCommand,
  deleteCommand,
} = require('../controllers/commandController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addBot).get(protect, getBots);
router.route('/:id').delete(protect, deleteBot);

// Command routes
router.route('/:botId/commands').post(protect, addCommand);
router
  .route('/:botId/commands/:commandId')
  .put(protect, updateCommand)
  .delete(protect, deleteCommand);

module.exports = router;
