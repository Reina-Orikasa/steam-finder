import { useEffect, useState } from 'react';
import GameRec from './GameRec';
import Input from './Input';
import MostPlayed from './MostPlayed';

export function App() {
  const [profileInfo, setProfileInfo] = useState('');
  const [profileSearch, updateProfileSearch] = useState('');
  let [errorMsg, updateErrorMsg] = useState('');
  let [privateAccount, setPrivateAccount] = useState(false);
  let dataLoaded = false;
  let allAppIds = '';
  let [newWorth, setNewWorth] = useState(0);
  let value = 0;
  async function getProfileInfo() {
    let totalGames = '';
    let gamesNeverPlayed = 0;
    let maxHours = 0;
    let maxGameName = '';
    let maxGameId = '';
    let totalHours = 0;
    let allGameIds = [];
    const response = await fetch(
      `/.netlify/functions/steam-fetch?steamid=${profileSearch}`
    );
    const json = await response.json();

    if (response.status !== 500) {
      updateErrorMsg('');
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

      let recentAppId = '';
      let recentImg_icon_url = '';
      let recentName = '';
      let recentPlaytime2Weeks = '';

      if (json[3].response.games === undefined) {
        // private account
        updateErrorMsg('Your account must be set to public!');
        setPrivateAccount(true);
      } else if (json[2].response.total_count == 0) {
        // non-private account, no recent playtime in 2 weeks
        recentAppId = null;
        recentImg_icon_url = null;
        recentName = 'None';
        recentPlaytime2Weeks = 0;

        totalGames = json[3].response.game_count;
        json[3].response.games.forEach((item) => {
          totalHours += item.playtime_forever;
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
      } else {
        // non-private account, recent playtime in 2 weeks true
        setPrivateAccount(false);
        let recentGame = json[2].response;
        recentAppId = recentGame.games[0].appid;
        recentName = recentGame.games[0].name;
        recentPlaytime2Weeks = recentGame.games[0].playtime_2weeks;

        totalGames = json[3].response.game_count;
        json[3].response.games.forEach((item) => {
          totalHours += item.playtime_forever;
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
      }

      setProfileInfo({
        avatarfull,
        personaname,
        realname,
        player_level,
        personastate,
        gameextrainfo,
        recentAppId,
        recentImg_icon_url,
        recentName,
        recentPlaytime2Weeks,
        totalGames,
        gamesNeverPlayed,
        loccountrycode,
        maxHours,
        maxGameName,
        maxGameId,
        profileurl,
        allGameIds,
        totalHours,
      });
    } else {
      updateErrorMsg('You have attempted to enter an invalid steamID64!');
    }
  }

  if (profileInfo.maxGameId != undefined) {
    dataLoaded = true;
  }

  let {
    avatarfull,
    personaname,
    player_level,
    personastate,
    gameextrainfo,
    recentAppId,
    recentName,
    recentPlaytime2Weeks,
    recentImg_icon_url,
    totalGames,
    gamesNeverPlayed,
    loccountrycode,
    maxHours,
    maxGameId,
    profileurl,
    allGameIds,
    totalHours,
  } = profileInfo;

  let joinedGameIds;
  let separatedStrings = [];

  if (allGameIds) {
    joinedGameIds = _.join(allGameIds, ',');

    // Break the joinedGameIds string into separate strings with a specified maximum length
    const maxLength = 450; // Set the maximum length you want

    while (joinedGameIds.length > maxLength) {
      let lastIndex = joinedGameIds.lastIndexOf(',', maxLength);

      if (lastIndex === -1) {
        lastIndex = maxLength;
      }

      separatedStrings.push(joinedGameIds.substring(0, lastIndex));
      joinedGameIds = joinedGameIds.substring(lastIndex + 1);
    }

    if (joinedGameIds.length > 0) {
      separatedStrings.push(joinedGameIds);
    }

    allAppIds = allGameIds.join(',');
  }

  // Function to perform a fetch request using a comma-separated string
  async function fetchData(commaSeparatedIds) {
    const url = `/.netlify/functions/getProfileWorth?allIds=${commaSeparatedIds}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // Perform fetch requests using each separated comma-separated string
  async function getNewWorth() {
    try {
      const results = await Promise.all(
        separatedStrings.map(async (ids) => await fetchData(ids))
      );

      results.map((json) => {
        for (let key in json) {
          if (json[key].data) {
            if (json[key].data.price_overview) {
              value += json[key].data.price_overview.final;
            }
          }
        }
      });
      setNewWorth(value);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // old value fetch, does not work for longer strings > ~500
  // async function getProfileWorth() {
  //   const response = await fetch(
  //     `/.netlify/functions/getProfileWorth?allIds=${allAppIds}`
  //   );
  //   let profileWorth = 0;
  //   const json = await response.json();
  //   for (let key in json) {
  //     if (json[key].data) {
  //       if (json[key].data.price_overview) {
  //         profileWorth += json[key].data.price_overview.final;
  //       }
  //     }
  //   }
  //   setProfileValue(profileWorth);
  // }

  function updateInput(value) {
    updateProfileSearch(value);
  }

  function searchProfile() {
    getProfileInfo();
  }

  if (recentImg_icon_url != null) {
    recentImg_icon_url = `https://cdn.akamai.steamstatic.com/steam/apps/${profileInfo.recentAppId}/capsule_231x87.jpg`;
  }

  useEffect(() => {
    getProfileInfo();
  }, []);

  useEffect(() => {
    getNewWorth();
  }, [allAppIds]);

  useEffect(() => {
    searchProfile();
  }, [profileSearch]);

  return (
    <div className="">
      <div className="text-center mb-6 ">
        <h1 className="text-6xl">Steam Finder</h1>
        <h2 className="text-4xl">Totally not a copy of another site...</h2>
      </div>

      <div className="mt-6 mb-12 text-center">
        <Input changeInput={updateInput} searchId={profileSearch} />
        <p className="text-xl text-red-500 font-bold">{errorMsg}</p>
        <p>
          <a
            href="https://steamid.io/"
            className="hover:underline text-pink-600"
            target="_blank"
          >
            Please go here to find your steamID64
          </a>{' '}
        </p>
      </div>

      {profileInfo === undefined || profileInfo === '' || privateAccount ? (
        <div className="text-center">
          <h2>Loading...</h2>
        </div>
      ) : (
        <div>
          <div className="flex justify-center align-middle">
            <div className="bg-pink-300 py-2 px-10 rounded-xl">
              <div className="flex justify-center align-middle my-8 space-x-4">
                <div>
                  <img
                    src={avatarfull}
                    className="rounded-xl shadow-lg mr-4"
                    alt="avatar image"
                    width={184}
                    height={184}
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
                      <span className="text-slate-900 text-xl font-bold">
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
          </div>
          <div className="mt-4 lg:mx-24 lg:px-24">
            <div className="bg-pink-300 text-center py-6 sm:px-48 rounded-xl">
              {newWorth === 0 ? (
                'calculating'
              ) : (
                <p className="font-light text-slate-800 text-lg">
                  <span className="font-semibold text-slate-900 text-4xl">
                    ${(newWorth / 100).toFixed(2)}*
                  </span>{' '}
                </p>
              )}

              <p>estimated account game value</p>
              <p className="font-light text-slate-800 text-lg mb-4">
                (includes current sales)
              </p>
              <p className="px-12">
                Disclaimer: games such as GTA V do not return a base price from
                Steam's API. This is due to GTA V (and likely other games) not
                selling a base game. Your account value will likely be higher
                and this is intended to give you a general value of how much
                your account is worth.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 md:gap-2 lg:mx-48 my-4">
            <div className="text-center bg-pink-300 p-6 rounded-xl mb-4">
              <div className="flex justify-center align-middle">
                {recentImg_icon_url === null ? (
                  ''
                ) : (
                  <img
                    src={recentImg_icon_url}
                    className="rounded-xl shadow-lg mb-3"
                    alt="image of recent game"
                    width={231}
                    height={87}
                  ></img>
                )}
              </div>
              <p className="font-light">Most played game in 2 weeks:</p>
              <a
                href={'https://store.steampowered.com/app/' + recentAppId}
                className="text-slate-900 font-bold hover:underline text-2xl"
                target="_blank"
              >
                {recentName}
              </a>
              <h2 className="text-xl text-slate-800 font-semibold">
                {(recentPlaytime2Weeks / 60).toFixed(1)} hours last two weeks.
              </h2>
            </div>
            <div className="text-center bg-pink-300 p-6 md:mb-4 rounded-xl">
              <p className="font-light text-xl text-slate-900 md:mt-4">
                <span className="text-3xl font-bold">{totalGames} </span>owned
                games
              </p>
              <p className="font-light text-xl text-slate-900">
                <span className="text-3xl font-bold">{gamesNeverPlayed}</span>{' '}
                games unplayed
              </p>
              <p className="font-light text-xl text-slate-900">
                <span className="text-3xl font-bold">
                  {((100 * gamesNeverPlayed) / totalGames).toFixed(0)}%{' '}
                </span>{' '}
                of library unplayed
              </p>
              <p className="font-light text-xl text-slate-900">
                <span className="text-3xl font-bold">
                  {(totalHours / 60).toFixed(1)}{' '}
                </span>{' '}
                hours wasted...
              </p>
            </div>
          </div>
        </div>
      )}

      {dataLoaded === false || privateAccount ? (
        'loading...'
      ) : (
        <>
          <MostPlayed appId={maxGameId} gameHours={maxHours} />
          <GameRec allIds={allGameIds} />
        </>
      )}
    </div>
  );
}
