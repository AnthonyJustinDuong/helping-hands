/* Chat Room model */
'use strict';

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.ObjectId,
    required: true,
  },
  content: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const ChatRoomSchema = new mongoose.Schema({
  creator: {
    type: mongoose.ObjectId,
    required: true,
  },
  otherChatter: {
    type: mongoose.ObjectId,
    required: true,
  },
  log: {
    type: [MessageSchema],
    default: [],
  }
})

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
module.exports = { ChatRoom };
