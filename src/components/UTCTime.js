import React , {useEffect, useState , useRef} from "react";
import '../styles/UTCTime.css'

export function UTCTime() {
    const [currentTime, setCurrentTime] = useState("00:00:00");
    const buttonRef = useRef()
    const fetchTime = () => {
      fetch("http://worldtimeapi.org/api/timezone/Etc/UTC")
        .then((response) => response.json())
        .then((data) => {
          const currentTime = new Date(data.utc_datetime);
          const hours = currentTime.getHours();
          const minutes = currentTime.getMinutes();
          const seconds = currentTime.getSeconds();
  
          // 添加前导零
          const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
            minutes < 10 ? "0" + minutes : minutes
          }:${seconds < 10 ? "0" + seconds : seconds}`;
  
          setCurrentTime(formattedTime);
          console.log("set time success");
        })
        .catch((error) => {
          console.log("请求时间失败:", error);
        });
    };

    useEffect(()=>{
        fetchTime()
        if(buttonRef.current){
            buttonRef.current.addEventListener("click",fetchTime);
        }
        return ()=>{
            if(buttonRef.current)buttonRef.current.removeEventListener("click",fetchTime);
        }
    },[])

  
    return (
      <div className="UTCTime">
        <p>{currentTime}</p>
        <button className="UTCTimeButton" ref={buttonRef}>Get UTC !</button>
      </div>
    );
  }