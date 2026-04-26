const apiKey = "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": apiKey };

async function run() {
  const res = await fetch(`https://v3.football.api-sports.io/teams?search=Akron`, { headers });
  const data = await res.json();
  console.log("Akron ID:", data.response[0].team.id);
  
  const teamId = data.response[0].team.id;
  const res2 = await fetch(`https://v3.football.api-sports.io/players?search=Arevalo&team=${teamId}`, { headers });
  const data2 = await res2.json();
  if (data2.response && data2.response.length > 0) {
      const playerObj = data2.response[0];
      console.log(`✅ Jugador encontrado: ${playerObj.player.name}`);
      playerObj.statistics.forEach(stats => {
        console.log(`   -> Temp: ${stats.league.season} | Liga: ${stats.league.name} | Partidos: ${stats.games.appearences || 0}`);
      });
  } else {
      console.log("No encontrado");
  }
}

run();
