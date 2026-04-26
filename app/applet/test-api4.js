async function run() {
  try {
    const res2 = await fetch('https://site.api.espn.com/apis/v2/sports/soccer/conmebol.libertadores/standings');
    const data2 = await res2.json();
    const team = data2.children[0].standings.entries[0].team;
    console.log("Standings Team logo structure:", JSON.stringify(team.logo || team.logos, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
