import React, { useEffect, useRef, useState } from "react";
import { Monster } from "./monster";
import { Item } from "./item";
export function ClickGame() {
    const size = 45;
    const [monsterName, setMonsterName] = useState('');
    const [message, setMessage] = useState('')
    const draw = useRef(0)
    const tileSize = 6;
    const A = 5;
    const canvasRef = useRef();
    const ctxRef = useRef(null);
    const frameRequest = useRef(null);
    const [slot,setSlot] = useState(null);
    const [bag,setBag] = useState(null);
    //console.log("render" , performance.now())
    useEffect(() => {
        function drawTile(x, y, color) {
            if (ctxRef) {
                if (!color) { color = `rgb(255,255,255)`; }
                ctxRef.current.fillStyle = color;
                ctxRef.current.fillRect(Math.floor(x * tileSize), Math.floor((y) * tileSize), tileSize, tileSize);
            } else console.log("no ref");
        }
        const drawTileMap = function (colorArr) {
            if (ctxRef.current) {
                // 绘制所有的 tile
                // clearTileMap();
                for (let y = 0; y < colorArr[0].length; y += 1) {
                    for (let x = 0; x < colorArr.length; x += 1) {
                        drawTile(x, y, colorArr[x][y] ? (colorArr[x][y] === true ? 'black' : colorArr[x][y]) : "white");
                    }
                }
            } else console.log("no ref");
        }
        function clearTileMap() {
            if (ctxRef.current) {
                for (let y = 0; y < (size + 2 * A); y += 1) {
                    for (let x = 0; x < size; x += 1) {
                        drawTile(x, y, "white");
                    }
                }
            }
        }
        let lastFrameTime = performance.now();
        let lazyFrameTime = performance.now();
        let monster = new Monster(size);
        let item = new Item() ;
        let msg = " ";
        function updateUI(text){
            if(text)msg = text ;
            setMonsterName(`${monster.name} LV. ${monster.level}`);
            setMessage(
`HP  ${monster.hp.toFixed(0)}/${monster.maxHp.toFixed(0)} 
clickDmg  ${monster.click.toFixed(0)} + ${item.click.toFixed(0)}  idleDMG   ${monster.dps.toFixed(0)} + ${item.dps.toFixed(0)}
${msg}
` );
            setSlot(
                ()=>item.slots?.map((obj,idx)=>(
                    <div key={idx}>
                        {item.getStringItem(obj)}
                    </div>                    
                    ))
            )
            setBag(
                ()=>item.items?.map((obj,idx)=>(
                    <div key={idx} style={{display:"flex"}}>
                        {item.getStringItem(obj)}
                        <button onClick={()=>{item.equip(idx);}}  style={{marginLeft:"auto"}}>装备</button>
                    </div>                    
                    ))
            );
        }
        function drawGroupFrame(currentFrameTime) {
            //console.log(">>frame",currentFrameTime);
            if (ctxRef.current) {
                drawTileMap(monster.generateColorTilemap(currentFrameTime, A));
                let isDead = monster.getDamage((currentFrameTime - lastFrameTime) / 1000 * (monster.dps + item.dps )) ;
                let drop = isDead && Math.random()>0.2;
                if ( isDead || currentFrameTime - lazyFrameTime > 250 ) {
                    updateUI(drop ? `${item.generate(monster.level)} Dropped by idleDMG` : null) ;
                    lazyFrameTime = currentFrameTime;
                }

                frameRequest.current = requestAnimationFrame(drawGroupFrame);
            }
            lastFrameTime = currentFrameTime;
        }
        if (canvasRef.current) {
            ctxRef.current = canvasRef.current.getContext('2d');
            const clickFn = function (event) {
                {// 获取鼠标点击的位置
                    const mouseX = event.clientX;
                    const mouseY = event.clientY;

                    // 获取 Canvas 元素的位置和尺寸
                    const canvasRect = canvasRef.current.getBoundingClientRect();
                    const canvasX = canvasRect.left;
                    const canvasY = canvasRect.top;

                    // 计算相对于 Canvas 坐标系的点击位置
                    const relativeMouseX = mouseX - canvasX;
                    const relativeMouseY = mouseY - canvasY;

                    // 计算鼠标点击所在的 tile 的索引
                    const clickedTileX = Math.floor(relativeMouseX / tileSize);
                    const clickedTileY = Math.floor(relativeMouseY / tileSize);

                    console.log('Clicked on tile:', clickedTileX, ',', clickedTileY);
                }
                let isDead = monster.getDamage(monster.click + item.click)
                let drop = isDead || Math.random()>0.9;
                updateUI(drop ? `${item.generate(monster.level)} dropped by click`:null);
                console.log(draw.current);
                draw.current += 1;
            }
            if (ctxRef.current) {
                updateUI("Game Start !");
                frameRequest.current = requestAnimationFrame(drawGroupFrame);

            }
            // 监听 Canvas 元素的 click 事件
            canvasRef.current.addEventListener('click', clickFn);

            return () => {
                if (canvasRef.current) canvasRef.current.removeEventListener('click', clickFn);
                if (frameRequest.current) cancelAnimationFrame(frameRequest.current);
            }
        }
    }, [])

    return (
        <div>
            <div >Click Game</div>
            <div>
                <div width="80%">{monsterName}</div>
                <canvas ref={canvasRef} height={(size + 2 * A) * tileSize} width={size * tileSize}></canvas>
                <div  style={{whiteSpace: "pre-wrap"}}>{message}</div>
                <div>EQUIPMENT</div>
                {slot}
                <div>ITEMS</div>
                {bag}
            </div>
        </div>
    )
}
