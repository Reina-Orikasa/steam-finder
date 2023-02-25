import { useEffect, useState } from 'react';

export default function GameRec(appId) {
  const [gameInfo, setGameInfo] = useState('');
  const [gameAppId, setgameAppId] = useState(appId.id);
  const [loadingState, setLoadingState] = useState(false);
  let loadingRandomGame = false;

  function getGameInfo() {
    if (gameAppId !== undefined) {
      fetch(`/.netlify/functions/getGameInfo?appId=${gameAppId}`)
        .then((resp) => resp.json())
        .then((info) => setGameInfo(Object.values(info)[0].data));
    }
  }
  let suggestGameURL = `https://store.steampowered.com/app/${gameAppId}`;

  function getRandomGame() {
    setgameAppId(appId.allIds[Math.floor(Math.random() * appId.allIds.length)]);
  }

  // random game
  useEffect(() => {
    setLoadingState(true);
    loadingRandomGame = true;
    setTimeout(() => {
      loadingRandomGame = false;
      setLoadingState(false);
      getGameInfo();
    }, 1500);
  }, [gameAppId]);

  // initial load
  useEffect(() => {
    setLoadingState(true);
    loadingRandomGame = true;
    setTimeout(() => {
      loadingRandomGame = false;
      setLoadingState(false);
      getRandomGame();
    }, 200);
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
                  <p className="text-xl font-light">
                    {gameInfo.release_date.date}
                  </p>
                </div>
              )}
              <p className="md:px-48 mb-4">{gameInfo.short_description}</p>
              <button
                className="border-2 rounded-xl p-2 my-2"
                onClick={getRandomGame}
              >
                Another!
              </button>
              <p>{loadingState || loadingRandomGame ? 'loading' : ''}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
