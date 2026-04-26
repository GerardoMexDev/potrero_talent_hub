const apiKey = "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": apiKey };

async function testBypass(playerName, teamId) {
  try {
    console.log(`\nBuscando a ${playerName} sin especificar temporada...`);
    const res = await fetch(`https://v3.football.api-sports.io/players?search=${encodeURIComponent(playerName)}&team=${teamId}`, { headers });
    const data = await res.json();
    
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.log(`❌ Error: ${JSON.stringify(data.errors)}`);
    } else if (data.response && data.response.length > 0) {
      const playerObj = data.response[0];
      console.log(`✅ Jugador encontrado: ${playerObj.player.name}`);
      playerObj.statistics.forEach(stats => {
        console.log(`   -> Temp: ${stats.league.season} | Liga: ${stats.league.name} | Partidos: ${stats.games.appearences || 0}`);
      });
    } else {
      console.log(`❌ No se encontraron datos.`);
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

async function run() {
  // 2348 = Peñarol
  await testBypass("Batista", 2348);
  
  // 2315 = Colo Colo
  await testBypass("Vidal", 2315);
  await testBypass("Mendez", 2315);
  
  // 2683 = Akron
  await testBypass("Arevalo", 2683);
}

run();
