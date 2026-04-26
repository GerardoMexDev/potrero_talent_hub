async function run() {
  try {
    const currentYear = new Date().getFullYear();
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/conmebol.libertadores/scoreboard?dates=${currentYear}0101-${currentYear}1231&limit=1000`);
    const data = await res.json();
    const countries = new Set();
    data.events?.forEach(e => {
      const country = e.competitions[0]?.venue?.address?.country;
      if (country) countries.add(country);
    });
    console.log("Countries:", Array.from(countries));
  } catch (e) {
    console.error(e);
  }
}
run();
