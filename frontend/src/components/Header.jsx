import React from 'react';

function Header() {
  return (
    <header className="p-4 bg-gray-200 flex justify-between items-center">
      <h1 className="text-xl font-bold">AI Video Script Generator</h1>
      <div className="flex items-center">
        <button className="mr-4">
          <span className="material-icons">notifications</span>
        </button>
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="rounded-full"
        />
      </div>
    </header>
  );
}

export default Header; 