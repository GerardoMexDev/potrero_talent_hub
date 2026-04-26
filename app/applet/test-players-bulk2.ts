import "dotenv/config";
const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

const players = [
  { p: "Tabo", t: "2370", n: "Christian Tabo (Deportivo Maldonado)" },
  { p: "Tabó", t: "2370", n: "Christian Tabó (Deportivo Maldonado)" },
  { p: "Pinela", t: "14279", n: "Maximiliano Pinela (Tepatitlan)" },
  { p: "Sotto", t: "2361", n: "Kevin Sotto (Boston River)" },
  { p: "Loprete", t: "2359", n: "Luca Loprete (Racing)" },
  { p: "Pereira", t: "2352", n: "Bautista Pereira (Danubio)" },
  { p: "Rodriguez", t: "22227", n: "Ivan Rodriguez (Bella Italia)" },
  { p: "Villar", t: "2555", n: "Edu Villar (Huancayo)" },
  { p: "Martinez", t: "2555", n: "Juan David Martinez (Huancayo)" },
  { p: "Moretti", t: "2546", n: "Jair Moretti (Cristal)" },
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
