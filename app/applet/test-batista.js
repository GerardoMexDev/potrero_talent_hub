const testBatista = async () => {
  const myHeaders = new Headers();
  myHeaders.append("x-apisports-key", "dae110beb9a23c4398a6066a0a1649b4");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    console.log("Buscando a Facundo Batista...");
    // Buscamos por nombre
    const response = await fetch("https://v3.football.api-sports.io/players?search=Facundo Batista", requestOptions);
    const result = await response.json();
    
    if (result.errors && Object.keys(result.errors).length > 0) {
      console.log("Errores en la API:", result.errors);
      return;
    }

    if (result.response && result.response.length > 0) {
      // Filtramos para asegurarnos de que es el que juega en Peñarol (o tomamos el primero)
      const playerObj = result.response.find(p => 
        p.statistics.some(s => s.team.name.toLowerCase().includes("peñarol") || s.team.name.toLowerCase().includes("penarol"))
      ) || result.response[0];

      console.log(`\nJugador encontrado: ${playerObj.player.name} (ID: ${playerObj.player.id})`);
      console.log(`Nacionalidad: ${playerObj.player.nationality}`);
      
      console.log(`\n=== ESTADÍSTICAS RECIENTES ===`);
      // Mostramos las estadísticas de las competiciones más recientes
      playerObj.statistics.forEach(stats => {
        // Solo mostramos si tiene apariciones para no llenar la consola de torneos donde no jugó
        if (stats.games.appearences > 0 || stats.team.name.toLowerCase().includes("penarol")) {
          console.log(`\nTemporada: ${stats.league.season} | Equipo: ${stats.team.name} | Torneo: ${stats.league.name}`);
          console.log(`Partidos: ${stats.games.appearences || 0} | Titular: ${stats.games.lineups || 0} | Minutos: ${stats.games.minutes || 0}`);
          console.log(`Suplente (Entró): ${stats.substitutes.in || 0} | Se quedó en banca: ${stats.substitutes.bench || 0}`);
          console.log(`Goles: ${stats.goals.total || 0} | Asistencias: ${stats.goals.assists || 0}`);
        }
      });
    } else {
      console.log("No se encontró al jugador.");
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

testBatista();
