import React,{useState,useRef,useEffect} from "react";
import '../styles/Timer.css'
//练习requestAnimationFrame的使用
export function Timer(){
    const [clockTime , setClockTime] = useState(0)
    const [buttonStr,setButtonStr] = useState("START")
    const resetButtonRef = useRef()
    const startButtonRef = useRef()
    var frameRequest;
    var isStart = false ;
    var lastFrameTime = 0 ;
    var timer = 0 ;
    useEffect(()=>{
        function reset(){
            timer = 0 ;
            setClockTime(0.0)
            setButtonStr("STRAT")
        }
        if(resetButtonRef.current){
            resetButtonRef.current.addEventListener("click",reset)
        }
        return ()=>{
            if(resetButtonRef.current)resetButtonRef.current.removeEventListener("click",reset)
        }
    },[])

    useEffect(()=>{
        function start(){
            isStart = !isStart ;
            if(isStart){setButtonStr("PAUSE")}
            else{setButtonStr("CONTINUE")}
        }
        if(startButtonRef.current){
            startButtonRef.current.addEventListener("click",start)
        }
        return ()=>{
            if(startButtonRef.current)startButtonRef.current.removeEventListener("click",start)
        }
    },[])

    useEffect(
    ()=>{
        const tick = (currentFrameTime) => {
            if(isStart){
                timer += currentFrameTime - lastFrameTime ;
                setClockTime((timer/1000).toFixed(1))
            } 
            lastFrameTime = currentFrameTime ;  
            frameRequest = requestAnimationFrame(tick);
        };
        frameRequest = requestAnimationFrame(tick);
        return ()=>{
            cancelAnimationFrame(frameRequest);
        }
    }    
    ,[])

    return(
        <div className="Timer">
            <p>Timer</p>
            <p>{clockTime}</p>
            <div>
                <button className="TimerButton" ref = {startButtonRef} >{buttonStr}</button>
            </div>
            <div>
                <button className="TimerButton" ref = {resetButtonRef} >RESET TIME</button>
            </div>
        </div>
    )
}