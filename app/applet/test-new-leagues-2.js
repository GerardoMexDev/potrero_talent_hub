const testLeagueAndTeams = async (slug, searchTeams) => {
  try {
    const res = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${slug}/standings`);
    if (!res.ok) {
      console.log(`[${slug}] Failed: ${res.status}`);
      return;
    }
    const data = await res.json();
    console.log(`[${slug}] Name: ${data.name}`);
    
    if (data.children) {
      data.children.forEach(c => {
        if (c.standings && c.standings.entries) {
          c.standings.entries.forEach(e => {
            const teamName = e.team.displayName.toLowerCase();
            searchTeams.forEach(searchTeam => {
              if (teamName.includes(searchTeam.toLowerCase())) {
                console.log(`[${slug}] Found ${searchTeam}: ID = ${e.team.id}, Name = ${e.team.displayName}`);
              }
            });
          });
        }
      });
    }
    console.log('---');
  } catch (e) {
    console.log(`[${slug}] Error: ${e.message}`);
  }
};

const run = async () => {
  console.log("Testing Chilean League...");
  await testLeagueAndTeams('chi.1', ['Colo']);
  
  console.log("Testing Peruvian League...");
  await testLeagueAndTeams('per.1', ['Melgar', 'Huancayo', 'Cristal']);
};

run();
