import "dotenv/config";

const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

async function checkById() {
  const res = await fetch(`https://v3.football.api-sports.io/players?id=9723`, { headers });
  const data = await res.json();
  console.log(data);
}
checkById();
