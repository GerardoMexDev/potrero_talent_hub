async function run() {
  try {
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/conmebol.libertadores/scoreboard?dates=2026&limit=1000');
    const data = await res.json();
    console.log("Total events with dates=2026:", data.events?.length);
  } catch (e) {
    console.error(e);
  }
}
run();
