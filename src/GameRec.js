import { useEffect, useState } from 'react';

export default function GameRec(appId) {
  const [gameInfo, setGameInfo] = useState('');
  const [gameAppId, setgameAppId] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  function getGameInfo(retryCount = 0) {
    const maxRetries = 5;

    if (gameAppId !== undefined && gameAppId !== '') {
      fetch(`/.netlify/functions/getGameInfo?appId=${gameAppId}`)
        .then((resp) => resp.json())
        .then((info) => setGameInfo(Object.values(info)[0].data))
        .then(setLoadingState(false))
        .catch((err) => {
          console.log(`Error occurred: ${err}, you pepega.`);
          if (retryCount < maxRetries) {
            console.log(`Retrying... Attempt ${retryCount + 1}`);
            getGameInfo(retryCount + 1);
          } else {
            console.log('Max retries reached. No more attempts.');
          }
        });
    }
  }
  let suggestGameURL = `https://store.steampowered.com/app/${gameAppId}`;

  function getRandomGame() {
    setgameAppId(appId.allIds[Math.floor(Math.random() * appId.allIds.length)]);
  }

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted
    let timeoutId;

    // Function to set loading state
    const setLoading = (isLoading) => {
      if (isMounted) {
        setLoadingState(isLoading);
      }
    };

    // Load game information
    const loadGameInfo = () => {
      if (gameAppId) {
        setLoading(true);
        timeoutId = setTimeout(() => {
          if (isMounted) {
            getGameInfo();
          }
        }, 1000);
      }
    };

    // Load a random game
    const loadRandomGame = () => {
      setLoading(true);
      timeoutId = setTimeout(() => {
        if (isMounted) {
          getRandomGame();
        }
      }, 200);
    };

    // Determine which function to call based on the state
    if (gameAppId) {
      loadGameInfo();
    } else if (appId && appId.allIds && appId.allIds.length > 0) {
      loadRandomGame();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [gameAppId, appId]);

  return (
    <>
      <div className="mb-8 lg:mx-24 lg:px-24">
        <div className="bg-pink-300 text-center p-8 rounded-xl">
          {loadingState || gameInfo === undefined ? (
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
                  width={460}
                  height={215}
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
              <p>{loadingState ? 'loading' : ''}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
