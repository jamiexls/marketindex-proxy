import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/asx/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toLowerCase();
  const url = `https://www.marketindex.com.au/asx/${symbol}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "text/html"
      }
    });

    const $ = cheerio.load(response.data);

    const getText = (selector) => $(selector).first().text().trim() || "N/A";

    const data = {
      name: getText("h1"), 
      price: getText(".price"),
      marketCap: getText("th:contains('Market Cap') + td"),
      peRatio: getText("th:contains('P/E Ratio') + td"),
      yield: getText("th:contains('Dividend Yield') + td"),
      sector: getText("th:contains('Sector') + td"),
      sharesOnIssue: getText("th:contains('Shares on Issue') + td"),
      week52Range: getText("th:contains('52 Week Range') + td"),
      oneYearReturn: getText("th:contains('1 Year Return') + td")
    };

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Fetch failed", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
