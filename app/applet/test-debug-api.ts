import "dotenv/config";

const API_KEY = process.env.API_SPORTS_KEY || "dae110beb9a23c4398a6066a0a1649b4";
const headers = { "x-apisports-key": API_KEY };

async function testPlayerId() {
  console.log("Testing player fetch by ID (829) with NO season...");
  const res = await fetch(`https://v3.football.api-sports.io/players?id=829`, { headers });
  const data = await res.json();
  console.log("Result:", JSON.stringify(data, null, 2));

  console.log("\nTesting player fetch by Search+Team NO season...");
  const res2 = await fetch(`https://v3.football.api-sports.io/players?search=Vidal&team=2315`, { headers });
  const data2 = await res2.json();
  console.log("Result 2:", "Total array length in response: " + data2.response?.length);
}
testPlayerId();
