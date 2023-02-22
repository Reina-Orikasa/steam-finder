import { useEffect, useState } from 'react';

export default function GameRec(appId) {
  console.log(appId);
  const [gameInfo, setGameInfo] = useState('');
  const [gameAppId, setgameAppId] = useState(appId.id);
  let loadingRandomGame = false;
  function getGameInfo() {
    fetch(`/.netlify/functions/getGameInfo?appId=${gameAppId}`)
      .then((resp) => resp.json())
      .then((info) => setGameInfo(Object.values(info)[0].data));
  }
  let suggestGameURL = `https://store.steampowered.com/app/${gameAppId}`;

  function getRandomGame() {
    setgameAppId(appId.allIds[Math.floor(Math.random() * appId.allIds.length)]);
    loadingRandomGame = true;
  }
  useEffect(() => {
    setTimeout(() => {
      getGameInfo();
      loadingRandomGame = false;
    }, 1500);
  }, [gameAppId]);

  useEffect(() => {
    setTimeout(() => {
      getRandomGame();
      loadingRandomGame = false;
    }, 500);
  }, [appId]);

  return (
    <>
      <div className="mb-8 lg:mx-24 lg:px-24">
        <div className="bg-pink-300 text-center p-8 rounded-xl">
          {loadingRandomGame || gameInfo === undefined ? (
            'loading...'
          ) : (
            <>
              <h1 className="text-4xl mb-4 font-semibold">
                How about this game?
              </h1>
              <div className="flex justify-center align-middle mb-6">
                <img
                  src={gameInfo.header_image}
                  className="rounded-xl mb-2"
                  alt="image of the recommended game"
                />
              </div>

              <h2 className="font-bold text-3xl">
                <a
                  href={suggestGameURL}
                  className="hover:underline"
                  target="_blank"
                >
                  {gameInfo.name}
                </a>
              </h2>
              {gameInfo === '' || gameInfo.price_overview === undefined ? (
                ''
              ) : (
                <div className="text-lg text-slate-800 mb-4">
                  <h4 className="text-xl font-light">
                    {gameInfo.release_date.date}
                  </h4>
                </div>
              )}
              <p className="md:px-48 mb-4">{gameInfo.short_description}</p>
              <button
                className="border-2 rounded-xl p-2 my-2"
                onClick={getRandomGame}
              >
                Another!
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
