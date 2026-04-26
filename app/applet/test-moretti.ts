import "dotenv/config";
const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

async function check() {
  const res = await fetch(`https://v3.football.api-sports.io/players?search=Moretti&team=2546`, { headers });
  const d = await res.json();
  const seasons = [...new Set(d.response[0].statistics.map((s:any) => s.league.season))].sort((a:any, b:any) => b - a);
  console.log("Moretti seasons:", seasons);
}
check();
