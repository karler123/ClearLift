const mongoose = require("mongoose");

const seoReportSchema = new mongoose.Schema({
  url: String,
  title: String,
  metaDescription: String,
  h1Count: Number,
  imgCount: Number,
  imgWithoutAlt: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SEOReport", seoReportSchema);
