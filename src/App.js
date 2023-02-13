import { useEffect, useState } from 'react';
import GameRec from './GameRec';
import MostPlayed from './MostPlayed';

export function App() {
  const [profileInfo, setProfileInfo] = useState('');
  let dataLoaded = false;
  let randomGameId = 0;
  async function getProfileInfo() {
    const response = await fetch('/.netlify/functions/steam-fetch');
    const json = await response.json();
    const player_level = json[1].response.player_level;
    const {
      avatarfull,
      personaname,
      realname,
      personastate,
      gameextrainfo,
      loccountrycode,
      profileurl,
    } = json[0].response.players[0];
    const { appid, img_icon_url, name, playtime_forever } =
      json[2].response.games[0];
    const totalGames = json[3].response.game_count;
    let gamesNeverPlayed = 0;
    let maxHours = 0;
    let maxGameName = '';
    let maxGameId = '';
    let allGameIds = [];
    json[3].response.games.forEach((item) => {
      allGameIds.push(item.appid);
      if (item.playtime_forever > maxHours) {
        maxHours = item.playtime_forever;
        maxGameName = item.name;
        maxGameId = item.appid;
      }
      if (item.playtime_forever === 0) {
        gamesNeverPlayed++;
      }
    });

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
      loccountrycode,
      maxHours,
      maxGameName,
      maxGameId,
      profileurl,
      allGameIds,
    });
  }

  if (profileInfo.maxGameId != undefined) {
    dataLoaded = true;
    randomGameId =
      profileInfo.allGameIds[
        Math.floor(Math.random(profileInfo.allGameIds) * 100)
      ];
  }

  console.log(randomGameId);

  let {
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
    loccountrycode,
    maxHours,
    maxGameName,
    maxGameId,
    profileurl,
    allGameIds,
  } = profileInfo;

  const recentGameImageURL = `https://cdn.akamai.steamstatic.com/steam/apps/${profileInfo.appid}/capsule_231x87.jpg`;

  useEffect(() => {
    getProfileInfo();
  }, []);

  return (
    <div className="">
      <div className="text-center mb-6 ">
        <h1 className="text-6xl">Steam Finder</h1>
        <h2 className="text-4xl">Totally not a copy of another site...</h2>
      </div>

      <div className="mt-6 mb-12 text-center">
        <input
          className="bg-pink-300 text-black rounded-md px-4 py-2"
          placeholder="Search..."
        ></input>
      </div>

      {profileInfo === '' ? (
        <div className="text-center">
          <h2>Loading...</h2>
        </div>
      ) : (
        <div>
          <div className="md:w-1/2 md:ml-96 bg-pink-300 py-2 rounded-xl">
            <div className="flex justify-center align-middle my-8 space-x-4">
              <div>
                <img
                  src={avatarfull}
                  className="rounded-xl w-10/12 shadow-lg"
                />
              </div>
              <div className="">
                <h1 className="text-4xl md:text-5xl font-semibold mb-4">
                  <a
                    href={profileurl}
                    className="hover:underline"
                    target="_blank"
                  >
                    {personaname}
                  </a>
                </h1>
                <div className="mb-4">
                  <span className="border-2 border-pink-500 rounded-full p-2 mr-2 font-light">
                    {player_level}
                  </span>
                  {loccountrycode === undefined ? (
                    ''
                  ) : (
                    <span className="border-2 border-slate-700 rounded-full p-2 font-light">
                      {loccountrycode}
                    </span>
                  )}
                </div>

                {personastate === 1 ? (
                  <div className="mt-2">
                    <span className="text-slate-900 text-xl font-semibold">
                      Online
                    </span>
                    <p className="text-slate-900 font-semibold text-xl">
                      In game:{' '}
                      {gameextrainfo === undefined ? 'none' : gameextrainfo}
                    </p>
                  </div>
                ) : (
                  <span className="font-light">Currently Offline</span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:mx-48">
            <div className="text-center bg-pink-300 p-4 rounded-xl my-4">
              <div className="flex justify-center align-middle">
                <img
                  src={recentGameImageURL}
                  className="rounded-xl shadow-lg mb-3"
                ></img>
              </div>
              <p className="font-light">Recently played game:</p>
              <a
                href={'https://store.steampowered.com/app/' + appid}
                className="text-slate-900 font-bold hover:underline text-2xl"
                target="_blank"
              >
                {name}
              </a>
              <h2 className="text-xl text-slate-800 font-semibold">
                {(playtime_forever / 60).toFixed(1)} hours total
              </h2>
            </div>
            <div className="text-center bg-pink-300 p-4 rounded-xl my-4">
              <p className="font-bold text-2xl text-slate-900">
                {totalGames} owned games
              </p>
              <p className="text-slate-900 text-2xl font-bold">
                {gamesNeverPlayed} games unplayed
              </p>
              <p className="font-bold text-slate-900 text-2xl">
                {((100 * gamesNeverPlayed) / totalGames).toFixed(0)}% of library
                unplayed
              </p>
              <p>
                {maxGameName} most played with {(maxHours / 60).toFixed(1)}{' '}
                hours
              </p>
            </div>
          </div>
        </div>
      )}

      {dataLoaded === false ? (
        'loading...'
      ) : (
        <>
          <MostPlayed appId={maxGameId} gameHours={maxHours} />
          <GameRec id={randomGameId} allIds={allGameIds} />
        </>
      )}
    </div>
  );
}
