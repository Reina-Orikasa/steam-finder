import { useState } from 'react';

export default function Input(props) {
  const [currentInput, changeCurrentInput] = useState('');
  return (
    <>
      <label htmlFor="steamid">
        <input
          className="bg-pink-300 text-black rounded-md px-4 py-2"
          placeholder="Search..."
          onChange={(e) => changeCurrentInput(e.target.value)}
        ></input>
      </label>
      <button
        onClick={() => props.changeInput(currentInput)}
        className="p-2 border-slate-500 border rounded-xl ml-2"
      >
        Search
      </button>
    </>
  );
}
