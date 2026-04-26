const apiKey = "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": apiKey };

async function testSeasonAccess(playerId, season, description) {
  try {
    const res = await fetch(`https://v3.football.api-sports.io/players?id=${playerId}&season=${season}`, { headers });
    const data = await res.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.log(`❌ ${description} (Temp ${season}): Bloqueado - ${JSON.stringify(data.errors)}`);
    } else {
      console.log(`✅ ${description} (Temp ${season}): Permitido! Datos encontrados: ${data.response.length > 0 ? 'Sí' : 'No'}`);
    }
  } catch (e) {
    console.log(`Error en ${description}: ${e.message}`);
  }
}

async function run() {
  console.log("Probando acceso a temporadas 2025 y 2026 en el plan gratuito...\n");
  
  // Facundo Batista (Peñarol - Uruguay/Libertadores) - ID: 9723
  await testSeasonAccess(9723, 2024, "Facundo Batista (Uruguay)");
  await testSeasonAccess(9723, 2025, "Facundo Batista (Uruguay)");
  await testSeasonAccess(9723, 2026, "Facundo Batista (Uruguay)");

  // Kevin Arevalo (Akron - Rusia) - ID: 546150
  await testSeasonAccess(546150, 2024, "Kevin Arevalo (Rusia)");
  await testSeasonAccess(546150, 2025, "Kevin Arevalo (Rusia)");
  await testSeasonAccess(546150, 2026, "Kevin Arevalo (Rusia)");
  
  // Arturo Vidal (Colo Colo - Chile) - ID: 829
  await testSeasonAccess(829, 2024, "Arturo Vidal (Chile)");
  await testSeasonAccess(829, 2025, "Arturo Vidal (Chile)");
  await testSeasonAccess(829, 2026, "Arturo Vidal (Chile)");
}

run();
