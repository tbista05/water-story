import express, { Request, Response } from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3001;
app.use(cors()); // Important for frontend-backend communication

app.get("/api/buoy/:station", async (req, res) => {
  const { station } = req.params;
  const url = `https://www.ndbc.noaa.gov/data/realtime2/${station}.txt`;

  try {
    const text = await fetch(url).then(r => r.text());
    const lines = text.trim().split("\n");
    const cols = lines[1].trim().split(/\s+/);
    const latest = lines[lines.length - 1].trim().split(/\s+/);

    const idx = {
      wtmp: cols.indexOf("WTMP"),
      wspd: cols.indexOf("WSPD"),
      wvht: cols.indexOf("WVHT"),
    };

    res.json({
      station,
      waterTemp: latest[idx.wtmp],
      windSpeed: latest[idx.wspd],
      waveHeight: latest[idx.wvht],
      time: latest[0] + "/" + latest[1] + "/" + latest[2] + " " + latest[3] + ":" + latest[4],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch buoy data" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API server listening on http://localhost:${PORT}`);
});

