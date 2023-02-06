import { useEffect, useState } from 'react';

export function App() {
  const [profileInfo, setProfileInfo] = useState('');
  async function getProfileInfo() {
    const response = await fetch('/.netlify/functions/steam-fetch');
    const json = await response.json();
    const player_level = json[1].response.player_level;
    const { avatarfull, personaname, realname, personastate, gameextrainfo } =
      json[0].response.players[0];
    const { appid, img_icon_url, name, playtime_forever } =
      json[2].response.games[0];
    console.log(json[3].response.game_count);
    const totalGames = json[3].response.game_count;
    let gamesNeverPlayed = 0;
    json[3].response.games.forEach((item) => {
      if (item.playtime_forever === 0) {
        gamesNeverPlayed++;
      }
    });
    console.log(gamesNeverPlayed);
    setProfileInfo({
      avatarfull,
      personaname,
      realname,
      player_level,
      personastate,
      gameextrainfo,
      appid,
      img_icon_url,
      name,
      playtime_forever,
      totalGames,
      gamesNeverPlayed,
    });
  }

  const recentGameImageURL = `https://cdn.akamai.steamstatic.com/steam/apps/${profileInfo.appid}/capsule_231x87.jpg`;

  useEffect(() => {
    getProfileInfo();
  }, []);

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-6xl">Steam Finder</h1>
        <h2 className="text-4xl">Totally not a copy of another site...</h2>
      </div>

      <div className="mt-6 mb-12 text-center">
        <input
          className="bg-gray-600 text-white rounded-md p-2"
          placeholder="Search..."
        ></input>
      </div>

      <div className="md:w-1/2 md:ml-96 pl-24">
        <div className="flex justify-center align-middle my-8">
          <div className="-mr-2">
            <img
              src={profileInfo.avatarfull}
              className="rounded-xl w-10/12 shadow-lg"
            />
          </div>
          <div className="">
            <h1 className="text-4xl md:text-6xl font-semibold mb-2">
              {profileInfo.personaname}
            </h1>
            <span className="border-2 border-green-500 rounded-full p-2">
              {profileInfo.player_level}
            </span>
            {profileInfo.personastate === 1 ? (
              <div className="mt-2">
                <span className="text-green-400">Online</span>
                <p>
                  In game:{' '}
                  {profileInfo.gameextrainfo === ''
                    ? profileInfo.gameextrainfo
                    : 'none'}
                </p>
              </div>
            ) : (
              <span className="ml-2">Offline</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center align-middle mt-36">
        <img
          src={recentGameImageURL}
          className="rounded-xl shadow-lg mb-3"
        ></img>
      </div>
      <div className="text-center">
        <p className="font-light">
          Recently played game:{' '}
          <a
            href={'https://store.steampowered.com/app/' + profileInfo.appid}
            className="font-bold hover:underline"
            target="_blank"
          >
            {profileInfo.name}
          </a>
        </p>
        <h2>Total hours: {(profileInfo.playtime_forever / 60).toFixed(1)}</h2>
      </div>
      <div className="text-center">
        <p>
          Total games owned:{' '}
          <span className="font-bold text-sky-500">
            {profileInfo.totalGames}
          </span>
        </p>
        <p>Total games unplayed: {profileInfo.gamesNeverPlayed}</p>
        <p>
          Percent of library unplayed:{' '}
          <span className="font-bold text-sky-500">
            {(
              (100 * profileInfo.gamesNeverPlayed) /
              profileInfo.totalGames
            ).toFixed(0)}
            %
          </span>
        </p>
      </div>
    </div>
  );
}
