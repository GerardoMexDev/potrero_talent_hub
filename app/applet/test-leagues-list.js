const fetchAllLeagues = async () => {
  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/leagues`);
    const data = await res.json();
    
    if (data.leagues) {
      const porLeagues = data.leagues.filter(l => l.slug.includes('por') || l.name.toLowerCase().includes('portugal') || l.name.toLowerCase().includes('u23'));
      console.log("Found Portugal/U23 Leagues:");
      porLeagues.forEach(l => console.log(`- ${l.name} (${l.slug})`));
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
};

fetchAllLeagues();
