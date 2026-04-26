import "dotenv/config";
const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

async function searchTeamsFallback() {
  const teams = ["Penarol", "Danubio", "Bella Vista", "Huancayo", "Cristal", "Sporting", "Moquegua", "Sydney FC", "Racing", "Juventud"];
  for (const t of teams) {
    const res = await fetch(`https://v3.football.api-sports.io/teams?search=${encodeURIComponent(t)}`, { headers });
    const data = await res.json();
    if (data.response?.length > 0) {
      console.log(`Team "${t}":`, data.response.slice(0,2).map((r:any) => `${r.team.name} (id: ${r.team.id}, ${r.team.country})`));
    } else {
       console.log(`Team "${t}" -> NO`);
    }
  }
}
searchTeamsFallback();
