import "dotenv/config";
const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

async function getTeamsFromCountries() {
  const check = async (search: string) => {
    const res = await fetch(`https://v3.football.api-sports.io/teams?search=${encodeURIComponent(search)}`, { headers });
    return await res.json();
  }
  
  console.log("Sydney:", (await check("Sydney")).response?.map((r:any)=>`${r.team.name} (${r.team.id}, ${r.team.country})`));
  console.log("Racing:", (await check("Racing")).response?.filter((r:any)=>r.team.country==='Uruguay').map((r:any)=>`${r.team.name} (${r.team.id}, ${r.team.country})`));
  console.log("Juventud:", (await check("Juventud")).response?.filter((r:any)=>r.team.country==='Uruguay').map((r:any)=>`${r.team.name} (${r.team.id}, ${r.team.country})`));
  console.log("Bella Italia:", (await check("Bella Italia")).response?.map((r:any)=>`${r.team.name} (${r.team.id}, ${r.team.country})`));
}
getTeamsFromCountries();
