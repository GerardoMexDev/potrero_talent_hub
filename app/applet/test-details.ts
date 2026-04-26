import "dotenv/config";
const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

const ps = [
  { p: "Batista", t: "2348", n: "Facundo Batista" },
  { p: "Mendez", t: "2315", n: "Javier Méndez" },
  { p: "Arevalo", t: "6786", n: "Kevin Arevalo" },
  { p: "Cruz", t: "2353", n: "Alejo Cruz" },
  { p: "Alexandrino", t: "2376", n: "Renato Alexandrino" },
  { p: "Salas", t: "2554", n: "Javier Salas" },
  { p: "Sotto", t: "2361", n: "Kevin Sotto" },
  { p: "Loprete", t: "2359", n: "Luca Loprete" },
  { p: "Villar", t: "2555", n: "Edu Villar" },
  { p: "Moretti", t: "2546", n: "Jair Moretti" },
  { p: "Amasifuen", t: "22489", n: "Nicolas Amasifuen" },
  { p: "Quispe", t: "943", n: "Piero Quispe" }
];

async function checkDetails() {
  for (const p of ps) {
    const res = await fetch(`https://v3.football.api-sports.io/players?search=${p.p}&team=${p.t}`, { headers });
    const d = await res.json();
    if (d.response && d.response.length > 0) {
      const player = d.response[0].player;
      const stats = d.response[0].statistics;
      const seasons = [...new Set(stats.map((s:any) => s.league.season))].sort((a:any, b:any) => b - a);
      console.log(`[${p.n}] Photo: ${player.photo}`);
      console.log(`         Seasons: ${seasons.join(', ')}`);
    } else {
      console.log(`[${p.n}] Not found`);
    }
  }
}
checkDetails();
