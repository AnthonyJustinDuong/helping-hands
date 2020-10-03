"use strict";

const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  author: mongoose.ObjectId,
  post: mongoose.ObjectId,
  content: String,
});

const Report = mongoose.model("Report", ReportSchema);

module.exports = { Report };
