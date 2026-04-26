import "dotenv/config";

const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

async function testBatistaSeasons() {
  const getStats = async (season: string) => {
    const res = await fetch(`https://v3.football.api-sports.io/players?id=9723&season=${season}`, { headers });
    return await res.json();
  };

  console.log("2024:", (await getStats("2024")).errors);
  console.log("2025:", (await getStats("2025")).errors);
  console.log("2026:", (await getStats("2026")).errors);
}
testBatistaSeasons();
