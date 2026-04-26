import fetch from 'node-fetch';
async function run() {
  const res = await fetch('https://site.api.espn.com/apis/v2/sports/soccer/conmebol.sudamericana/standings');
  const data = await res.json();
  data.children?.forEach((child, i) => {
    console.log(`Child ${i} keys:`, Object.keys(child));
    if (!child.standings) console.log(`Child ${i} missing standings!`);
    else if (!child.standings.entries) console.log(`Child ${i} missing entries!`);
  });
}
run();
