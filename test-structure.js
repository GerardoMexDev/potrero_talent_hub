async function run() {
  const res = await fetch('https://site.api.espn.com/apis/v2/sports/soccer/uru.1/standings');
  const data = await res.json();
  console.log("Children count:", data.children?.length);
  if (data.children && data.children.length > 0) {
    console.log("First child keys:", Object.keys(data.children[0]));
    console.log("Has standings?", !!data.children[0].standings);
    if (data.children[0].standings) {
        console.log("Standings keys:", Object.keys(data.children[0].standings));
    }
  }
}
run();
