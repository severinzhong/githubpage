import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { UTCTime} from './components/UTCTime'
import { OverlayPage } from './components/OverlayPage';
import { Timer } from './components/Timer';
import {TodoList} from './components/TodoList'
import { ClickGame } from './game/ClickGame/ClickGame';
function App() {
  const [clickerCount, setClickerCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" onClick={() => { setClickerCount(clickerCount + 1) }} />
        <p >
          Click the logo <br></br> {clickerCount}
        </p>
        <OverlayPage name="Timer"  component={<Timer />}/>
        <OverlayPage name ="UTC Time" component={<UTCTime />}/>
        <OverlayPage name="Todo List" component={<TodoList/>}/>
        <OverlayPage name="Click Game" component={<ClickGame/>}/>
      </header>
    </div>
  );
}

export default App;
