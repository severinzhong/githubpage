import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {toggleFullscreen} from './utils/fullsreenController'

function App() {
  const [clickerCount, setClickerCount] = useState(0);

  useEffect(() => {
    let installPrompt = null;
    const installButton = document.querySelector("#install");
    const fullscreenButton = document.querySelector("#fullscreen");
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      installPrompt = event;
      installButton.removeAttribute("hidden");
    });

    installButton.addEventListener("click", async () => {
      if (!installPrompt) {
        return;
      }
      const result = await installPrompt.prompt();
      console.log(`Install prompt was: ${result.outcome}`);
      installPrompt = null;
      installButton.setAttribute("hidden", "");
    });

    fullscreenButton.addEventListener("click",toggleFullscreen);
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" onClick={() => { setClickerCount(clickerCount + 1) }} />
        <p>
          Edit <code>src/App.js</code> and save to reload.<br></br>
        </p>
        <p >
          test {clickerCount}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button id="install" hidden>Install</button>
        <button id="fullscreen">Fullscreen</button>
      </header>
    </div>
  );
}

export default App;
