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
  }, []);

  if (!maxGameInfo) {
    return null;
  } else {
    const { header_image, steam_appid, release_date, short_description, name } =
      maxGameInfo;
    return (
      <div className="mb-4 md:mx-24 px-24">
        <div className="bg-pink-300 text-center p-8 rounded-xl">
          <h1>Your most played game</h1>
          <div className="flex justify-center align-middle mb-6">
            <img src={header_image} className="rounded-xl mb-2" />
          </div>

          <h2 className="font-bold text-xl">
            <a
              href={`https://store.steampowered.com/app/${steam_appid}`}
              className="hover:underline"
              target="_blank"
            >
              {name}
            </a>
          </h2>

          <h3>{(maxGameId.gameHours / 60).toFixed(1)} hours</h3>

          <div className="text-lg text-slate-800 mb-4">
            <h2>{release_date.date}</h2>
          </div>

          <p className="md:px-48">{short_description}</p>
        </div>
      </div>
    );
  }
}
