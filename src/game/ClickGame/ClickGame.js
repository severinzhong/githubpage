import React, { useEffect, useRef, useState } from "react";
import { Game } from "../game";
import { Monster } from "./monster";
export function ClickGame() {
    const size = 45;
    const [monster, setMonster] = useState(new Monster(size));
    const [monsterName,setMonsterName] = useState(monster.name);
    const [message,setMessage] = useState('')
    const draw = useRef(0)
    const tileSize = 6;
    const A = 5 ;
    const canvasRef = useRef();
    const ctxRef = useRef(null);
    const frameRequest = useRef(null)
    

    useEffect(() => {
        function drawTile(x, y, color) {
            if (ctxRef) {
                if (!color) {color = `rgb(255,255,255)`;}
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
                        drawTile(x, y, colorArr[x][y] ? (colorArr[x][y] === true ? 'black' : colorArr[x][y])  : "white");
                    }
                }
            } else console.log("no ref");
        }
        function clearTileMap() {
            if (ctxRef.current) {
                for (let y = 0; y < (size+2*A); y += 1) {
                    for (let x = 0; x < size; x += 1) {
                        drawTile(x, y, "white");
                    }
                }
            }
        }
        let lastFrameTime = performance.now() ;
        function drawGroupFrame(currentFrameTime){
            if(ctxRef.current){
                drawTileMap(monster.generateColorTilemap(currentFrameTime,A));
                frameRequest.current = requestAnimationFrame(drawGroupFrame);
                monster.hp -= (currentFrameTime - lastFrameTime)/1000 * monster.dps ;

                if (monster.hp<=0) {

                    //dead
                    monster.maxHp *= 1.2 ;
                    monster.hp = monster.maxHp ;
                    monster.level += 1 ;
                    monster.dps *= 1.1 ;
                    monster.click *= 1.1 ;
                    // new 
                    monster.generate({ x: size, y: size });
                    setMonsterName(`${monster.name} LV. ${monster.level}`);
                }

                setMessage(`HP  ${monster.hp.toFixed(0)}/${monster.maxHp.toFixed(0)}`)

            }
            lastFrameTime = currentFrameTime ;
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

                console.log('Clicked on tile:', clickedTileX, ',', clickedTileY);}
                monster.hp -= monster.click ;

                console.log(draw.current);

                draw.current += 1;
            }
            if (ctxRef.current) {
                drawTileMap(monster.generateColorTilemap(0,A));
                setMonsterName(`${monster.name} LV. ${monster.level}`);
                monster.level = 0 ;
                monster.maxHp = 100 ;
                monster.hp = monster.maxHp ;
                monster.dps = 10 ;
                monster.click = 30 ;
                frameRequest.current = requestAnimationFrame(drawGroupFrame);
            }
            // 监听 Canvas 元素的 click 事件
            canvasRef.current.addEventListener('click', clickFn);

            return () => {
                if (canvasRef.current) canvasRef.current.removeEventListener('click', clickFn);
                if (frameRequest.current)cancelAnimationFrame(frameRequest.current);
            }
        }
    }, [])

    // useEffect(() => {
    //     console.log(">>>tilemap changed");
    //     if (ctxRef.current) {
    //         drawTileMap(monster.tileMap);
    //     }
    // }, [monster])

    return (
        <div>
            <div >Click Game</div>
            <div>
                <div width="80%">{monsterName}</div>
                <canvas ref={canvasRef} height={(size+2*A) * tileSize} width={size * tileSize}></canvas>
                <div>{message}</div>
            </div>
        </div>
    )
}
