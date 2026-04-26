import "dotenv/config";
const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

const ps = [
  { id: "batista", p: "Batista", t: "2348", n: "Facundo Batista", tn: "Peñarol" },
  { id: "mendez", p: "Mendez", t: "2315", n: "Javier Méndez", tn: "Colo Colo" },
  { id: "arevalo", p: "Arevalo", t: "6786", n: "Kevin Arevalo", tn: "Akron Tolyatti" },
  { id: "cruz", p: "Cruz", t: "2353", n: "Alejo Cruz", tn: "Juventud" },
  { id: "alexandrino", p: "Alexandrino", t: "2376", n: "Renato Alexandrino", tn: "Club Oriental" },
  { id: "salas", p: "Salas", t: "2554", n: "Javier Salas", tn: "FBC Melgar" },
  { id: "sotto", p: "Sotto", t: "2361", n: "Kevin Sotto", tn: "Boston River" },
  { id: "loprete", p: "Loprete", t: "2359", n: "Luca Loprete", tn: "Racing Montevideo" },
  { id: "villar", p: "Villar", t: "2555", n: "Edu Villar", tn: "Sport Huancayo" },
  { id: "moretti", p: "Moretti", t: "2546", n: "Jair Moretti", tn: "Sporting Cristal" },
  { id: "amasifuen", p: "Amasifuen", t: "22489", n: "Nicolas Amasifuen", tn: "Deportivo Moquegua" },
  { id: "quispe", p: "Quispe", t: "943", n: "Piero Quispe", tn: "Sydney FC" }
];

async function getPhotos() {
  let out = "";
  for (const p of ps) {
    const res = await fetch(`https://v3.football.api-sports.io/players?search=${p.p}&team=${p.t}`, { headers });
    const d = await res.json();
    const photo = d.response?.[0]?.player?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.n)}&background=1a1a1a&color=eab308&size=150`;
    out += `  {\n    id: "${p.id}",\n    name: "${p.n}",\n    searchApi: "${p.p}",\n    teamId: "${p.t}",\n    teamName: "${p.tn}",\n    photo: "${photo}",\n    teamLogo: "https://media.api-sports.io/football/teams/${p.t}.png"\n  },\n`;
  }
  console.log(out);
}
getPhotos();
