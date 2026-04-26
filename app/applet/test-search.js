const searchTeam = async (query) => {
  try {
    // ESPN doesn't have a global team search that is easily accessible without a league,
    // but we can try to hit the global search endpoint if it exists.
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/search?query=${query}&limit=10`);
    const data = await res.json();
    console.log(`Search results for ${query}:`);
    // The search API might not exist or might have a different structure.
    console.log(JSON.stringify(data, null, 2).substring(0, 500));
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
};

searchTeam('Sporting CP U23');
