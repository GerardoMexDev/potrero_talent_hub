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

async function checkPlayer(teamSearch) {
  try {
    const teamId = await getTeamId(teamSearch);
    if (!teamId) return;
    
    const squadRes = await fetch(`https://v3.football.api-sports.io/players/squads?team=${teamId}`, { headers });
    const squadData = await squadRes.json();
    
    if (squadData.response && squadData.response.length > 0) {
      const players = squadData.response[0].players;
      console.log(`Plantilla de ${teamSearch}:`);
      console.log(players.map(p => p.name).join(', '));
    }
  } catch (e) {}
}

checkPlayer("Akron");
