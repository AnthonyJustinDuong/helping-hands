"use strict";

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  author: mongoose.ObjectId,
  date: Date,
  status: Boolean,
  content: String,
});

const Post = mongoose.model("Post", PostSchema);

module.exports = { Post };
