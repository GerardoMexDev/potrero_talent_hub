const testCountries = async (slug) => {
  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard?limit=5`);
    const data = await res.json();
    
    if (data.events) {
      data.events.forEach(e => {
        const comp = e.competitions[0];
        console.log(`[${slug}] Venue Country: ${comp.venue?.address?.country}`);
      });
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
};

const run = async () => {
  await testCountries('mex.2');
  await testCountries('rus.1');
};

run();
