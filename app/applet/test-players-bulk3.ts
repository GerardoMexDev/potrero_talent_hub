import "dotenv/config";
const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

const players = [
  { p: "Guzman", t: "228", n: "Victor Guzman (Sporting CP)" },
  { p: "Amasifuen", t: "22489", n: "Nicolas Amasifuen (Moquegua)" },
  { p: "Quispe", t: "943", n: "Piero Quispe (Sydney FC)" },
];

async function checkPlayers() {
  for (const pl of players) {
    try {
      const res = await fetch(`https://v3.football.api-sports.io/players?search=${pl.p}&team=${pl.t}`, { headers });
      const data = await res.json();
      
      if (data.errors && Object.keys(data.errors).length > 0) {
        console.log(`[ERROR] ${pl.n}:`, data.errors);
      } else if (data.response?.length > 0) {
        // Encontrado. Veamos temporadas
        const stats = data.response[0].statistics;
        const seasons = [...new Set(stats.map((s:any) => s.league.season))];
        console.log(`[OK]    ${pl.n} -> Found! Seasons: ${seasons.join(', ')}`);
      } else {
        console.log(`[MISS]  ${pl.n} -> Not found in this team.`);
      }
    } catch (e) {
      console.log(`[FATAL] ${pl.n} -> Request failed`);
    }
  }
}
checkPlayers();
