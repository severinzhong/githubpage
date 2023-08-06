import React, { useEffect, useState ,useRef} from "react";


//gameEngin
export class Game{
    static instance ;
    frameRequest;
    tickQueue = [] ;

    constructor(){
        if(Game.instance)return Game.instance ;
        this.start();

        Game.instance = this ;
    }

    start(){
        let lastFrameTime = 0;
        const tick = (currentFrameTime) => {
            const delta = currentFrameTime - lastFrameTime;
            lastFrameTime = currentFrameTime;
            this.gameTick(delta);
            this.frameRequest = requestAnimationFrame(tick);
        };
        this.frameRequest = requestAnimationFrame(tick);
    }

    gameTick(delta){
        //do sth you want to every tick
        for(let i=0;i<this.tickQueue.length;i++)
            this.tickQueue[i](delta);
    }

    register(fn){
        this.tickQueue.push(fn);
        console.log(`registry success total ${this.tickQueue.length}`);
    }

    unregister(fn){
        this.tickQueue = this.tickQueue.filter(item => item !== fn);
        console.log("unregister success");
    }

    close(){
        cancelAnimationFrame(this.frameRequest);
    }
}

export function GameManager(){
    const [message,setMessage] = useState("");
    const monsterName = ["Branch","Freezing_Snow_Spaghetti","Huge_Overlord","Huge_Overlord","Sour_Gem"]
    const imgRef = useRef();
    let dps = 10 ;
    const game = new Game() ;
    let maxHp = 1000  ;
    let hp = maxHp ;
    let monster = "react" ;
    let after = ""
    const dpsFn = function (delta){ 
            const dmg = delta * dps / 1000 ;
            hp -= dmg ;
            if(hp<0){//monster dead
                console.log(`hp : ${hp}   dmg : ${dmg}`);
                maxHp *= 1.2 ;
                hp = maxHp ;
                dps *= 1.1 ;
                after = `\nYou Killed ${monster} !`
                monster = monsterName[Math.floor(Math.random() * monsterName.length)]
                if(imgRef.current){
                    imgRef.current.src = `./assets/monster/${monster}.png`;
                }
            }
            setMessage(`HP : ${hp.toFixed(0)} / ${maxHp.toFixed(0)} ${after}` ) ;
        };
    
    useEffect(()=>{
        game.register(dpsFn);
        return ()=>{
            game.unregister(dpsFn)
        }
    },[])

    useEffect(()=>{
        const clickFn = function(){
            dpsFn(10000);
        }

        if(imgRef.current)
            imgRef.current.addEventListener("click",clickFn);

        return ()=>{
            if(imgRef.current)
                imgRef.current.removeEventListener("click",clickFn);
        }
    }
    ,[imgRef])


    return (
        <div>
            <div >Click Game</div>
            <div >
                <img 
                src="./logo192.png"
                alt="monster"
                ref={imgRef}
                width={200}
                height={200}
                ></img>
            </div>
            <div style={{ whiteSpace: "pre-line" }} >{message}</div>
        </div>
    )
}
