const apiKey = "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": apiKey };

async function checkPlayerDirect(playerName, teamSearch) {
  try {
    const res = await fetch(`https://v3.football.api-sports.io/teams?search=${encodeURIComponent(teamSearch)}`, { headers });
    const data = await res.json();
    const teamId = data.response[0].team.id;
    
    const squadRes = await fetch(`https://v3.football.api-sports.io/players/squads?team=${teamId}`, { headers });
    const squadData = await squadRes.json();
    const players = squadData.response[0].players;
    
    const match = players.find(p => p.name.includes("Arevalo") || p.name.includes("Arévalo"));
    if (match) {
        console.log(`Encontrado: ${match.name} ID: ${match.id}`);
        // Let's check season 2024 for Akron
        const pRes = await fetch(`https://v3.football.api-sports.io/players?id=${match.id}&season=2024`, { headers });
        const pData = await pRes.json();
        
        if (pData.response && pData.response.length > 0) {
            const playerObj = pData.response[0];
            console.log(`✅ Jugador encontrado: ${playerObj.player.name} (ID: ${playerObj.player.id})`);
            playerObj.statistics.forEach(stats => {
               console.log(`\n  Temporada: ${stats.league.season} | Torneo: ${stats.league.name} | Equipo: ${stats.team.name}`);
               console.log(`  Partidos: ${stats.games.appearences || 0} | Titular: ${stats.games.lineups || 0} | Minutos: ${stats.games.minutes || 0}`);
               console.log(`  Goles: ${stats.goals.total || 0} | Asistencias: ${stats.goals.assists || 0}`);
            });
        } else {
            console.log("No stats for 2024. Trying 2023...");
            const pRes2 = await fetch(`https://v3.football.api-sports.io/players?id=${match.id}&season=2023`, { headers });
            const pData2 = await pRes2.json();
            if (pData2.response && pData2.response.length > 0) {
                const playerObj = pData2.response[0];
                console.log(`✅ Jugador encontrado: ${playerObj.player.name} (ID: ${playerObj.player.id})`);
                playerObj.statistics.forEach(stats => {
                   console.log(`\n  Temporada: ${stats.league.season} | Torneo: ${stats.league.name} | Equipo: ${stats.team.name}`);
                   console.log(`  Partidos: ${stats.games.appearences || 0} | Titular: ${stats.games.lineups || 0} | Minutos: ${stats.games.minutes || 0}`);
                   console.log(`  Goles: ${stats.goals.total || 0} | Asistencias: ${stats.goals.assists || 0}`);
                });
            } else {
                console.log("No stats for 2023 either.");
            }
        }
    }
  } catch (e) {}
}

checkPlayerDirect("Kevin Arevalo", "Akron");
