const apiKey = "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": apiKey };

async function checkPlayerDirect(playerId) {
  try {
    const pRes = await fetch(`https://v3.football.api-sports.io/players?id=${playerId}&season=2024`, { headers });
    const pData = await pRes.json();
    if (pData.response && pData.response.length > 0) {
       const playerObj = pData.response[0];
       console.log(`✅ Jugador encontrado: ${playerObj.player.name} (ID: ${playerObj.player.id})`);
       playerObj.statistics.forEach(stats => {
         if (stats.games.appearences > 0) {
           console.log(`\n  Temporada: ${stats.league.season} | Torneo: ${stats.league.name} | Equipo: ${stats.team.name}`);
           console.log(`  Partidos: ${stats.games.appearences || 0} | Titular: ${stats.games.lineups || 0} | Minutos: ${stats.games.minutes || 0}`);
           console.log(`  Goles: ${stats.goals.total || 0} | Asistencias: ${stats.goals.assists || 0}`);
         }
       });
    }
  } catch (e) {}
}

checkPlayerDirect(165180); // ID de J. Méndez en Colo Colo (deducido de la lista)
