import { useEffect, useState } from 'react';

export default function GameRec(appId) {
  const [gameInfo, setGameInfo] = useState('');
  const [gameAppId, setgameAppId] = useState('');
  async function getGameInfo() {
    await fetch(`/.netlify/functions/getGameInfo?appId=${appId.id}`)
      .then((resp) => resp.json())
      .then((info) => setGameInfo(Object.values(info)[0].data));
  }
  let suggestGameURL = `https://store.steampowered.com/app/${gameAppId}`;
  function getRandomGame() {
    setgameAppId(Math.floor(Math.random(appId.allIds) * 100));
  }
  useEffect(() => {
    getGameInfo();
    getRandomGame();
  }, []);

  console.log(gameAppId);
  return (
    <div className="mb-8 md:mx-24 px-24">
      <div className="bg-pink-300 text-center p-8 rounded-xl">
        <h1 className="text-4xl mb-4">How about this game?</h1>
        <div className="flex justify-center align-middle mb-6">
          <img src={gameInfo.header_image} className="rounded-xl mb-2" />
        </div>

        <h2 className="font-bold text-xl">
          <a href={suggestGameURL} className="hover:underline" target="_blank">
            {gameInfo.name}
          </a>
        </h2>
        {gameInfo.price_overview === undefined ? (
          ''
        ) : (
          <div className="text-lg text-slate-800 mb-4">
            <h2>{gameInfo.release_date.date}</h2>
          </div>
        )}
        <p className="md:px-48">{gameInfo.short_description}</p>
      </div>
    </div>
  );
}
