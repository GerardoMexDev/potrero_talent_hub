async function run() {
  try {
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/conmebol.libertadores/scoreboard');
    const data = await res.json();
    console.log("Scoreboard Event 0:", JSON.stringify(data.events[0], null, 2));
    
    const res2 = await fetch('https://site.api.espn.com/apis/v2/sports/soccer/conmebol.libertadores/standings');
    const data2 = await res2.json();
    console.log("Standings Group 0:", JSON.stringify(data2.children[0], null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
