import "dotenv/config";

const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

async function testAlternatives() {
  console.log("Testeando búsqueda de Tópicos (Goleadores) 2025/2026...");
  // Liga uruguaya es 270. Temporada la más reciente (2025 o 2026).
  const res1 = await fetch(`https://v3.football.api-sports.io/players/topscorers?league=270&season=2025`, { headers });
  const data1 = await res1.json();
  console.log("Top scorers 2025 errors:", data1.errors);

  console.log("\nTesteando Fixtures (Partidos) de 2025...");
  const res2 = await fetch(`https://v3.football.api-sports.io/fixtures?team=2348&season=2025`, { headers });
  const data2 = await res2.json();
  console.log("Fixtures 2025 errors:", data2.errors);
  
  if (data2.response && data2.response.length > 0) {
      const fixtureId = data2.response[0].fixture.id;
      console.log(`\nSacando datos del jugador desde el Fixture ${fixtureId}...`);
      const res3 = await fetch(`https://v3.football.api-sports.io/fixtures/players?fixture=${fixtureId}`, { headers });
      const data3 = await res3.json();
      console.log("Fixture Players errors:", data3.errors);
      if(data3.response && data3.response.length > 0) {
          console.log("ÉXITO: Se puede obtener estadísticas del jugador por partido individual!");
      }
  }
}
testAlternatives();
