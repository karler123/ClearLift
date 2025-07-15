const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const SEOReport = require("./models/SEOReport");


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://karlraymon31:mersar31@clearlift-cluster.zjaju93.mongodb.net/?retryWrites=true&w=majority&appName=clearlift-cluster", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));


app.post("/api/analyze", async (req, res) => {
  const { url } = req.body;

  try {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const title = $("title").text();
  const metaDescription = $('meta[name="description"]').attr("content") || "Missing";
  const h1Count = $("h1").length;
  const imgCount = $("img").length;
  const imgWithoutAlt = $("img").filter((i, el) => !$(el).attr("alt")).length;

  const newReport = new SEOReport({
    url,
    title,
    metaDescription,
    h1Count,
    imgCount,
    imgWithoutAlt,
  });

  await newReport.save();

  res.json({
    title,
    metaDescription,
    h1Count,
    imgCount,
    imgWithoutAlt,
    message: "✅ Report saved to database!",
  });
} catch (err) {
  res.status(500).json({ error: "❌ Could not fetch URL" });
}

});

app.listen(5000, () => {
  console.log("✅ ClearLift server running on http://localhost:5000");
});
