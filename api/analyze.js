import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content") || "Missing";
    const h1Count = $("h1").length;
    const imgCount = $("img").length;
    const imgWithoutAlt = $("img").filter((i, el) => !$(el).attr("alt")).length;

    return res.status(200).json({
      title,
      metaDescription,
      h1Count,
      imgCount,
      imgWithoutAlt,
    });
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch URL" });
  }
}
