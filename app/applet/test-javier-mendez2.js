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
  console.log(`Buscando: ${playerName} en ${teamSearch}`);
  try {
    const teamId = await getTeamId(teamSearch);
    if (!teamId) return;
    
    const squadRes = await fetch(`https://v3.football.api-sports.io/players/squads?team=${teamId}`, { headers });
    const squadData = await squadRes.json();
    
    if (squadData.response && squadData.response.length > 0) {
      const players = squadData.response[0].players;
      const match = players.find(pl => {
         const n = pl.name.toLowerCase();
         return n.includes("mendez") || n.includes("méndez") || n.includes("javier");
      });
      
      if (match) {
        console.log(`✅ Encontrado en plantilla de Peñarol: ${match.name} (ID: ${match.id})`);
        const pRes = await fetch(`https://v3.football.api-sports.io/players?id=${match.id}&season=2024`, { headers });
        const pData = await pRes.json();
        if (pData.response && pData.response.length > 0) {
           const playerObj = pData.response[0];
           playerObj.statistics.forEach(stats => {
             if (stats.games.appearences > 0 || stats.team.id === teamId) {
               console.log(`\n  Temporada: ${stats.league.season} | Torneo: ${stats.league.name} | Equipo: ${stats.team.name}`);
               console.log(`  Partidos: ${stats.games.appearences || 0} | Titular: ${stats.games.lineups || 0} | Minutos: ${stats.games.minutes || 0}`);
               console.log(`  Goles: ${stats.goals.total || 0} | Asistencias: ${stats.goals.assists || 0}`);
             }
           });
        }
      } else {
        console.log("No se encontró en la plantilla.");
      }
    }
  } catch (e) {}
}

checkPlayer("Javier Mendez", "Penarol");
