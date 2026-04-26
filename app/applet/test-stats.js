async function run() {
  const res = await fetch('https://site.api.espn.com/apis/v2/sports/soccer/uru.1/standings');
  const data = await res.json();
  const entries = data.children[0].standings.entries;
  console.log("First entry keys:", Object.keys(entries[0]));
  console.log("Has stats?", !!entries[0].stats);
}
run();
