const testApiFootball = async () => {
  const myHeaders = new Headers();
  myHeaders.append("x-apisports-key", "dae110beb9a23c4398a6066a0a1649b4");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    // Probaremos con un jugador conocido (Lionel Messi, ID: 153) en la temporada 2023
    // para asegurarnos de que la API devuelve datos completos.
    console.log("Consultando la API con tu clave...");
    const response = await fetch("https://v3.football.api-sports.io/players?id=153&season=2023", requestOptions);
    const result = await response.json();
    
    if (result.errors && Object.keys(result.errors).length > 0) {
      console.log("Errores en la API:", result.errors);
      return;
    }

    if (result.response && result.response.length > 0) {
      const playerInfo = result.response[0].player;
      const stats = result.response[0].statistics[0]; // Tomamos la primera competición (ej. MLS)
      
      console.log(`\n=== DATOS REALES OBTENIDOS ===`);
      console.log(`Jugador: ${playerInfo.name}`);
      console.log(`Equipo: ${stats.team.name}`);
      console.log(`Liga: ${stats.league.name}`);
      console.log(`\n--- ESTADÍSTICAS ---`);
      console.log(`Partidos Totales: ${stats.games.appearences}`);
      console.log(`De Titular: ${stats.games.lineups}`);
      console.log(`Minutos Jugados: ${stats.games.minutes}`);
      console.log(`Entró de Suplente: ${stats.substitutes.in}`);
      console.log(`Se quedó en banca: ${stats.substitutes.bench}`);
      console.log(`Goles: ${stats.goals.total}`);
      console.log(`Asistencias: ${stats.goals.assists}`);
      console.log(`Tarjetas Amarillas: ${stats.cards.yellow}`);
      
      console.log(`\nJSON Completo de estadísticas para esta liga:`);
      console.log(JSON.stringify(stats, null, 2));
    } else {
      console.log("No se encontraron datos.");
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

testApiFootball();
