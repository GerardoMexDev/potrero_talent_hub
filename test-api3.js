async function run() {
  try {
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/conmebol.libertadores/scoreboard?dates=20260101-20261231&limit=1000');
    const data = await res.json();
    console.log("Total events:", data.events?.length);
    if (data.events?.length > 0) {
      const firstEvent = data.events[0];
      console.log("First event date:", firstEvent.date);
      const team = firstEvent.competitions[0].competitors[0].team;
      console.log("Team logo structure:", JSON.stringify(team.logo || team.logos, null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}
run();
