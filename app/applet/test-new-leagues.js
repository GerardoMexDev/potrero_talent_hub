const testLeague = async (slug) => {
  try {
    const res = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${slug}/standings`);
    if (!res.ok) {
      console.log(`[${slug}] Failed: ${res.status}`);
      return;
    }
    const data = await res.json();
    console.log(`[${slug}] Name: ${data.name}`);
    
    let teams = [];
    if (data.children) {
      data.children.forEach(c => {
        if (c.standings && c.standings.entries) {
          c.standings.entries.forEach(e => teams.push(e.team.displayName));
        }
      });
    }
    console.log(`[${slug}] Teams: ${teams.join(', ')}`);
    console.log('---');
  } catch (e) {
    console.log(`[${slug}] Error: ${e.message}`);
  }
};

const run = async () => {
  console.log("Testing Mexican Leagues...");
  await testLeague('mex.1'); // Liga MX
  await testLeague('mex.2'); // Liga de Expansión MX?
  
  console.log("Testing Russian League...");
  await testLeague('rus.1'); // Russian Premier League
};

run();
