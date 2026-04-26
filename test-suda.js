async function run() {
  try {
    const res = await fetch('https://site.api.espn.com/apis/v2/sports/soccer/conmebol.sudamericana/standings');
    const data = await res.json();
    const teams = [];
    data.children?.forEach(group => {
      group.standings.entries.forEach(entry => {
        const t = entry.team;
        if (t.name.toLowerCase().includes('boston') || t.name.toLowerCase().includes('juventud')) {
          teams.push({ id: t.id, name: t.name, displayName: t.displayName });
        }
      });
    });
    console.log("Found Sudamericana teams from standings:", teams);
    
    // Also check scoreboard to be sure
    const res2 = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/conmebol.sudamericana/scoreboard?dates=20260101-20261231&limit=1000');
    const data2 = await res2.json();
    const teams2 = new Map();
    data2.events?.forEach(e => {
      e.competitions[0].competitors.forEach(c => {
        const t = c.team;
        if (t.name.toLowerCase().includes('boston') || t.name.toLowerCase().includes('juventud')) {
          teams2.set(t.id, { id: t.id, name: t.name, displayName: t.displayName });
        }
      });
    });
    console.log("Found Sudamericana teams from scoreboard:", Array.from(teams2.values()));
  } catch (e) {
    console.error(e);
  }
}
run();
