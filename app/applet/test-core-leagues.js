const fetchCoreLeagues = async () => {
  try {
    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/soccer/leagues?limit=1000`);
    const data = await res.json();
    
    if (data.items) {
      console.log(`Found ${data.items.length} leagues.`);
      for (const item of data.items) {
        if (item.$ref.includes('por') || item.$ref.includes('u23') || item.$ref.includes('revelacao')) {
           console.log(item.$ref);
        }
      }
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
};

fetchCoreLeagues();
