/* Leaderboard Model */
'use strict';
const mongoose = require('mongoose');

const LeaderSchema = new mongoose.Schema({
  rank: Number,
  name: String,
  points: Number
});

const LeaderboardSchema = new mongoose.Schema({
  city: String,
  leaders: [LeaderSchema]
});

const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
module.exports = { Leaderboard };
