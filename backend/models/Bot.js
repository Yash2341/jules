const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  botId: {
    type: Number,
    required: true,
    unique: true,
  },
  botUsername: {
    type: String,
    required: true,
  },
  commands: [
    {
      command: { type: String, required: true },
      message: { type: String, required: true },
    },
  ],
}, {
  timestamps: true,
});

const Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;
