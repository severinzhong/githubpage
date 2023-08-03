import React, { useState ,useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [clickerCount , setClickerCount] = useState(0) ;

  useEffect(()=>{

    let deferredPrompt;
    const addBtn = document.querySelector(".add-button");
    addBtn.style.display = "none";

    window.addEventListener("beforeinstallprompt", (e) => {
      // 防止 Chrome 67 及更早版本自动显示安装提示
      e.preventDefault();
      // 稍后再触发此事件
      deferredPrompt = e;
      // 更新 UI 以提醒用户可以将 App 安装到桌面
      addBtn.style.display = "block";
    
      addBtn.addEventListener("click", (e) => {
        // 隐藏显示 A2HS 按钮的界面
        // addBtn.style.display = "none";
        // 显示安装提示
        deferredPrompt.prompt();
        // 等待用户反馈
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the A2HS prompt");
          } else {
            console.log("User dismissed the A2HS prompt");
          }
          deferredPrompt = null;
        });
      });
    });
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" onClick={()=>{setClickerCount(clickerCount + 1)}} />
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
        <button className='add-button'>TEST</button>
      </header>
    </div>
  );
}

export default App;
