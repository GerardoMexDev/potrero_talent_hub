import "dotenv/config";

const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

async function checkPavez() {
  const res = await fetch(`https://v3.football.api-sports.io/players?search=Pavez&team=2315`, { headers });
  const data = await res.json();
  if (data.response && data.response.length > 0) {
    const stats = data.response[0].statistics;
    stats.forEach((s: any) => {
      console.log(`- Temp: ${s.league.season} | Liga: ${s.league.name} | Partidos: ${s.games.appearences || 0}`);
    });
  }
}
checkPavez();
