import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT;

app.get("/asx/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toLowerCase();
  const url = `https://www.marketindex.com.au/asx/${symbol}`;

  try {
const response = await axios.get(url, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Referer": "https://www.google.com/"
  }
});

    const $ = cheerio.load(response.data);

    const getData = (label) =>
      $(`th:contains("${label}")`)
        .next("td")
        .find("span")
        .first()
        .text()
        .trim() || "N/A";

    const data = {
      name: $("h1").first().text().trim(),
      price: $("dl.dl-horizontal dd").first().text().trim() || "N/A", // Adjusted: fallback method
      marketCap: getData("Market Cap"),
      peRatio: getData("P/E Ratio"),
      yield: getData("Dividend Yield"),
      sector: getData("Sector"),
      sharesOnIssue: getData("Shares on Issue"),
      week52Range: getData("52 Week Range"),
      oneYearReturn: getData("1 Year Return")
    };

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Fetch failed", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
