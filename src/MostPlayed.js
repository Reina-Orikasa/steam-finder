import { useEffect, useState } from 'react';

export default function MostPlayed(maxGameId) {
  const [maxGameInfo, setMaxGameInfo] = useState('');

  async function getMaxGameInfo() {
    await fetch(`/.netlify/functions/getGameInfo?appId=${maxGameId.appId}`)
      .then((resp) => resp.json())
      .then((info) => setMaxGameInfo(Object.values(info)[0].data));
  }

  useEffect(() => {
    getMaxGameInfo();
  }, [maxGameId]);

  if (maxGameInfo === '' || !maxGameInfo) {
    return null;
  } else {
    const { header_image, steam_appid, release_date, short_description, name } =
      maxGameInfo;
    return (
      <div className="mb-4 lg:mx-24 lg:px-24">
        <div className="bg-pink-300 text-center p-10 rounded-xl">
          <h1 className="text-4xl mb-4 font-semibold">Your most played game</h1>
          <div className="flex justify-center align-middle mb-6">
            <img
              src={header_image}
              className="rounded-xl mb-2"
              alt="image of your most played game"
            />
          </div>

          <h2 className="font-bold text-3xl">
            <a
              href={`https://store.steampowered.com/app/${steam_appid}`}
              className="hover:underline"
              target="_blank"
            >
              {name}
            </a>
          </h2>

          <h3 className="text-2xl font-bold">
            {(maxGameId.gameHours / 60).toFixed(1)} hours
          </h3>

          <div className="text-lg text-slate-800 mb-4">
            <h2 className="font-light">{release_date.date}</h2>
          </div>

          <p className="md:px-48">{short_description}</p>
        </div>
      </div>
    );
  }
}
