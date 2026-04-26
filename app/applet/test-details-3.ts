import "dotenv/config";
const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

const ps = [
  { p: "Amasifuen", t: "22489", n: "Nicolas Amasifuen" },
  { p: "Quispe", t: "943", n: "Piero Quispe" }
];

async function checkDetails() {
  for (const p of ps) {
    const res = await fetch(`https://v3.football.api-sports.io/players?search=${p.p}&team=${p.t}`, { headers });
    const d = await res.json();
    console.log(d.response[0].player.photo);
  }
}
checkDetails();
