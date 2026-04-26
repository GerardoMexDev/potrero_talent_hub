const testTeams = async (slug, searchTeam) => {
  try {
    const res = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${slug}/standings`);
    const data = await res.json();
    
    if (data.children) {
      data.children.forEach(c => {
        if (c.standings && c.standings.entries) {
          c.standings.entries.forEach(e => {
            if (e.team.displayName.includes(searchTeam) || e.team.name.includes(searchTeam)) {
              console.log(`[${slug}] Found ${searchTeam}: ID = ${e.team.id}, Name = ${e.team.displayName}`);
            }
          });
        }
      });
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
};

const run = async () => {
  await testTeams('mex.2', 'Tepatitlán');
  await testTeams('rus.1', 'Akron');
};

run();
