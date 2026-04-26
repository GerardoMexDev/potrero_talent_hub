const testLeagueAndTeams = async (slug, searchTeams) => {
  try {
    const res = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${slug}/standings`);
    if (!res.ok) {
      console.log(`[${slug}] Failed: ${res.status}`);
      return;
    }
    const data = await res.json();
    console.log(`[${slug}] Name: ${data.name}`);
    
    let found = false;
    if (data.children) {
      data.children.forEach(c => {
        if (c.standings && c.standings.entries) {
          c.standings.entries.forEach(e => {
            const teamName = e.team.displayName.toLowerCase();
            searchTeams.forEach(searchTeam => {
              if (teamName.includes(searchTeam.toLowerCase())) {
                console.log(`[${slug}] Found ${searchTeam}: ID = ${e.team.id}, Name = ${e.team.displayName}`);
                found = true;
              }
            });
          });
        }
      });
    }
    if (!found) {
      console.log(`[${slug}] Teams not found. Available teams:`);
      if (data.children) {
        data.children.forEach(c => {
          if (c.standings && c.standings.entries) {
            const allTeams = c.standings.entries.map(e => e.team.displayName).join(', ');
            console.log(`  ${allTeams}`);
          }
        });
      }
    }
    console.log('---');
  } catch (e) {
    console.log(`[${slug}] Error: ${e.message}`);
  }
};

const run = async () => {
  console.log("Testing Australian League...");
  await testLeagueAndTeams('aus.1', ['Sydney']);
  
  console.log("Testing Portugal Leagues...");
  await testLeagueAndTeams('por.1', ['Sporting']); // Primeira Liga
  await testLeagueAndTeams('por.2', ['Sporting']); // Liga Portugal 2
  await testLeagueAndTeams('por.u23', ['Sporting']); // Liga Revelacao U23?
  await testLeagueAndTeams('por.youth', ['Sporting']);
};

run();
