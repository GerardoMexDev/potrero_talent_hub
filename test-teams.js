async function run() {
  try {
    const res = await fetch('https://site.api.espn.com/apis/v2/sports/soccer/conmebol.libertadores/standings');
    const data = await res.json();
    const teams = [];
    data.children?.forEach(group => {
      group.standings.entries.forEach(entry => {
        const t = entry.team;
        if (t.name.toLowerCase().includes('peñarol') || t.name.toLowerCase().includes('cristal') || t.name.toLowerCase().includes('penarol')) {
          teams.push({ id: t.id, name: t.name, displayName: t.displayName });
        }
      });
    });
    console.log("Found teams:", teams);
  } catch (e) {
    console.error(e);
  }
}
run();
