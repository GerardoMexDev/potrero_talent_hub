const apiKey = "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": apiKey };

async function getTeamId(teamSearch) {
  const res = await fetch(`https://v3.football.api-sports.io/teams?search=${encodeURIComponent(teamSearch)}`, { headers });
  const data = await res.json();
  if (data.response && data.response.length > 0) {
    return data.response[0].team.id;
  }
  return null;
}

async function checkPlayer(playerName, teamSearch) {
  console.log(`\n======================================================`);
  console.log(`Buscando a ${playerName} en cualquier equipo...`);
  try {
    let res = await fetch(`https://v3.football.api-sports.io/players?search=${encodeURIComponent(playerName)}`, { headers });
    let data = await res.json();
    
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.log("Errores:", data.errors);
      // Si falla por falta de equipo, busquemos en Peñarol a Javier Mendez
      if (playerName === "Javier Mendez") {
         console.log("Buscando a Javier Mendez en Peñarol...");
         const teamId = await getTeamId("Penarol");
         res = await fetch(`https://v3.football.api-sports.io/players?search=${encodeURIComponent(playerName)}&team=${teamId}`, { headers });
         data = await res.json();
         if (data.response && data.response.length > 0) {
            const playerObj = data.response[0];
            console.log(`✅ Jugador encontrado: ${playerObj.player.name} (ID: ${playerObj.player.id})`);
            playerObj.statistics.forEach(stats => {
              if (stats.games.appearences > 0 || stats.team.id === teamId) {
                console.log(`\n  Temporada: ${stats.league.season} | Torneo: ${stats.league.name} | Equipo: ${stats.team.name}`);
                console.log(`  Partidos: ${stats.games.appearences || 0} | Titular: ${stats.games.lineups || 0} | Minutos: ${stats.games.minutes || 0}`);
                console.log(`  Goles: ${stats.goals.total || 0} | Asistencias: ${stats.goals.assists || 0}`);
              }
            });
         }
      }
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

async function run() {
  await checkPlayer("Javier Mendez", "Colo Colo");
}

run();
