import { useEffect, useState } from 'react';

export function App() {
  const [profileInfo, setProfileInfo] = useState('');
  async function getProfileInfo() {
    const response = await fetch('/.netlify/functions/steam-fetch');
    const json = await response.json();
    const player_level = json[1].response.player_level;
    const { avatarfull, personaname, realname, personastate, gameextrainfo } =
      json[0].response.players[0];
    setProfileInfo({
      avatarfull,
      personaname,
      realname,
      player_level,
      personastate,
      gameextrainfo,
    });
  }

  useEffect(() => {
    getProfileInfo();
  }, []);

  console.log(profileInfo.gameextrainfo);

  return (
    <div>
      <h1 className="bg-yellow-400 text-center">Hello world!</h1>
      <div className="flex justify-center align-middle mt-6">
        <div>
          <img
            src={profileInfo.avatarfull}
            className="rounded-xl w-9/12 shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-6xl font-bold">{profileInfo.personaname}</h1>
          {profileInfo.personastate === 1 ? (
            <div className="mb-2">
              <span className="text-green-400">Online</span>
              <p>In game: {profileInfo.gameextrainfo}</p>
            </div>
          ) : (
            <span>Offline</span>
          )}
          <span className="border-2 border-green-500 rounded-full p-2">
            {profileInfo.player_level}
          </span>
        </div>
      </div>
    </div>
  );
}
