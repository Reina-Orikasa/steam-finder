// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/

const fetch = require('node-fetch');

const handler = async function () {
  try {
    const api_key = process.env.STEAM_KEY;
    const response = Promise.all([
      fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${api_key}&steamids=76561198082350199`
      ).then((resp) => resp.json()),
      fetch(
        `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${api_key}&steamid=76561198082350199`
      ).then((resp) => resp.json()),
      fetch(
        `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${api_key}&steamid=76561198082350199&count=1`
      ).then((resp) => resp.json()),
      fetch(
        `
      https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${api_key}&steamid=76561198082350199&include_appinfo=true&include_extended_appinfo=false`
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
