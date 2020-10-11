'use strict'
const mongoose = require('mongoose');
console.log(process.env);
console.log(process.env.MONGODB_URI);
console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
console.log(process.env.GOOGLE_MAPS_API_KEY);
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/HelpingHandsAPI'
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
module.exports = { mongoose }
