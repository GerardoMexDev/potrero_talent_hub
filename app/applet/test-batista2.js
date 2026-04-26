const testBatistaTeam = async () => {
  const myHeaders = new Headers();
  myHeaders.append("x-apisports-key", "dae110beb9a23c4398a6066a0a1649b4");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    // Primero buscamos el ID de Peñarol
    console.log("Buscando a Peñarol...");
    const teamRes = await fetch("https://v3.football.api-sports.io/teams?search=Penarol", requestOptions);
    const teamData = await teamRes.json();
    
    if (teamData.response && teamData.response.length > 0) {
      const penarolId = teamData.response[0].team.id;
      console.log(`ID de Peñarol: ${penarolId}`);
      
      // Ahora buscamos a Facundo Batista en Peñarol
      console.log("\nBuscando a Facundo Batista en Peñarol...");
      const playerRes = await fetch(`https://v3.football.api-sports.io/players?search=Batista&team=${penarolId}`, requestOptions);
      const result = await playerRes.json();
      
      if (result.response && result.response.length > 0) {
        const playerObj = result.response[0];
        console.log(`\nJugador encontrado: ${playerObj.player.name} (ID: ${playerObj.player.id})`);
        
        console.log(`\n=== ESTADÍSTICAS RECIENTES ===`);
        playerObj.statistics.forEach(stats => {
          console.log(`\nTemporada: ${stats.league.season} | Equipo: ${stats.team.name} | Torneo: ${stats.league.name}`);
          console.log(`Partidos: ${stats.games.appearences || 0} | Titular: ${stats.games.lineups || 0} | Minutos: ${stats.games.minutes || 0}`);
          console.log(`Suplente (Entró): ${stats.substitutes.in || 0} | Se quedó en banca: ${stats.substitutes.bench || 0}`);
          console.log(`Goles: ${stats.goals.total || 0} | Asistencias: ${stats.goals.assists || 0}`);
        });
      } else {
        console.log("No se encontró a Batista en Peñarol.");
      }
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

testBatistaTeam();
