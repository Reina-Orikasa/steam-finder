// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

const fetch = require('node-fetch');

const handler = async function (event) {
  const query = event.queryStringParameters;
  console.log(query);
  let steamid = query.steamid;

  if (steamid === '') {
    steamid = '76561198082350199';
  }

  try {
    const api_key = process.env.STEAM_KEY;
    const response = Promise.all([
      fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${api_key}&steamids=${steamid}`
      ).then((resp) => resp.json()),
      fetch(
        `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${api_key}&steamid=${steamid}`
      ).then((resp) => resp.json()),
      fetch(
        `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${api_key}&steamid=${steamid}`
      ).then((resp) => resp.json()),
      fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${api_key}&steamid=${steamid}&include_appinfo=true&include_extended_appinfo=false`
      ).then((resp) => resp.json()),
    ]);

    const data = await response;

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // output to netlify function log
    console.log(error);
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    };
  }
};

module.exports = { handler };
