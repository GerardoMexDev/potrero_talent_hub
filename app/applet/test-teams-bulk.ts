import "dotenv/config";

const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

const teamsToSearch = [
  "Peñarol", "Colo Colo", "Akron", "Deportivo Maldonado", 
  "Juventud", "Tepatitlan", "Oriental", "Melgar", 
  "Boston River", "Racing", "Danubio", "Bella Italia", 
  "Sport Huancayo", "Sporting Cristal", "Sporting CP", 
  "Moquegua", "Sydney"
];

async function findTeams() {
  for (const t of teamsToSearch) {
    const res = await fetch(`https://v3.football.api-sports.io/teams?search=${encodeURIComponent(t)}`, { headers });
    const data = await res.json();
    if (data.response && data.response.length > 0) {
      // Tomamos el primero o mapeamos los primeros 3 para asegurarnos de elegir el correcto
      const matches = data.response.map((r:any) => `${r.team.name} (ID: ${r.team.id}, Country: ${r.team.country})`).slice(0, 3);
      console.log(`Team: "${t}" -> found:`, matches);
    } else {
      console.log(`Team: "${t}" -> NOT FOUND`);
    }
  }
}
findTeams();
