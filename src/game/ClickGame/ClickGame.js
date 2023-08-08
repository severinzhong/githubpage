import React, { useEffect, useRef, useState } from "react";
import { Game } from "../game";
import { Monster } from "./monster";
export function ClickGame() {
    const size = 45;
    const [monster, setMonster] = useState(new Monster(size));
    const [scheme, setScheme] = useState(monster.scheme);
    const [monsterName,SetMonsterName] = useState(monster.name);
    const draw = useRef(0)
    const tileSize = 6;
    const canvasRef = useRef();
    const ctxRef = useRef(null);
    const frameRequest = useRef(null)
    function drawTile(x, y, color) {
        if (ctxRef) {
            if (!color) {
                color = `rgb(255,255,255)`;
            }
            ctxRef.current.fillStyle = color;
            ctxRef.current.fillRect(Math.floor(x * tileSize), Math.floor((y+5) * tileSize), tileSize, tileSize);
        } else console.log("no ref");
    }

    const drawTileMap = function (colorArr) {
        if (ctxRef.current) {
            // 绘制所有的 tile
            clearTileMap();
            for (let y = 0; y < size; y += 1) {
                for (let x = 0; x < size; x += 1) {
                    drawTile(x, y, colorArr[x][y] ? "black" : "white");
                }
            }
        } else console.log("no ref");
    }
    function clearTileMap() {
        if (ctxRef.current) {
            for (let y = -5; y < (size+5); y += 1) {
                for (let x = 0; x < size; x += 1) {
                    drawTile(x, y, "white");
                }
            }
        }
    }
    function drawGroupFrame(currentFrameTime){
        if(ctxRef.current){
            let allGroup = monster.allGroup;
            clearTileMap();
            for (let i = 0; i < allGroup.groups.length; i++) {
                const arr = allGroup.groups[i].arr;
                let offset = Math.sin(currentFrameTime/250 + allGroup.groups[i].start_time*4.0)*20/tileSize ;
                for (let j = 0; j < arr.length; j++) {
                    const p = arr[j].position;
                    const c = arr[j].color;
                    if (monster.getAtPos(monster.tileMap, [p.x, p.y]) !== null) {
                        drawTile(p.x, p.y+offset, `rgb(${c[0] * 255},${c[1] * 255},${c[2] * 255})`)
                    }
                }
            }
            for (let i = 0; i < allGroup.negative_groups.length; i++) {
                if (allGroup.negative_groups[i].valid === false) continue;
                const arr = allGroup.negative_groups[i].arr;
                let offset = Math.sin(currentFrameTime/250 + allGroup.negative_groups[i].start_time*4.0)*20/tileSize ;
                for (let j = 0; j < arr.length; j++) {
                    const p = arr[j].position;
                    const c = arr[j].color;
                    if (monster.getAtPos(monster.tileMap, [p.x, p.y]) !== null) {
                        drawTile(p.x, p.y+offset, `rgb(${c[0] * 255},${c[1] * 255},${c[2] * 255})`)
                    }
                }
            }

            frameRequest.current = requestAnimationFrame(drawGroupFrame);
        }
        
    }

    function drwaGroup(allGroup) {
        if (ctxRef.current) {
            clearTileMap();
            for (let i = 0; i < allGroup.negative_groups.length; i++) {
                if (allGroup.negative_groups[i].valid === false) continue;
                const arr = allGroup.negative_groups[i].arr;
                for (let j = 0; j < arr.length; j++) {
                    const p = arr[j].position;
                    const c = arr[j].color;
                    if (monster.getAtPos(monster.tileMap, [p.x, p.y]) !== null) {
                        drawTile(p.x, p.y, `rgb(${c[0] * 255},${c[1] * 255},${c[2] * 255})`)
                    }
                }
            }
            for (let i = 0; i < allGroup.groups.length; i++) {
                const arr = allGroup.groups[i].arr;
                for (let j = 0; j < arr.length; j++) {
                    const p = arr[j].position;
                    const c = arr[j].color;
                    if (monster.getAtPos(monster.tileMap, [p.x, p.y]) !== null) {
                        drawTile(p.x, p.y, `rgb(${c[0] * 255},${c[1] * 255},${c[2] * 255})`)
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (canvasRef.current) {
            ctxRef.current = canvasRef.current.getContext('2d');
            const clickFn = function (event) {
                // 获取鼠标点击的位置
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
                console.log(draw.current);
                if (draw.current % 2 === 0) {
                    //drwaGroup(monster.allGroup);
                    frameRequest.current = requestAnimationFrame(drawGroupFrame);
                }
                if (draw.current % 2 === 1) {
                    cancelAnimationFrame(frameRequest.current);
                    monster.generate({ x: size, y: size });
                    SetMonsterName(monster.name);
                    drawTileMap(monster.tileMap);
                    setScheme(monster.scheme);
                }
                draw.current += 1;
            }
            if (ctxRef.current) {
                drawTileMap(monster.tileMap);
            }
            // 监听 Canvas 元素的 click 事件
            canvasRef.current.addEventListener('click', clickFn);

            return () => {
                if (canvasRef.current) canvasRef.current.removeEventListener('click', clickFn);
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
                <canvas ref={canvasRef} height={(size+10) * tileSize} width={size * tileSize}></canvas>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 50px)" }}>{scheme.map((c, index) => (
                    <div
                        key={index}
                        style={{
                            height: "50px",
                            width: "50px",
                            backgroundColor: `rgb(${c[0] * 255}, ${c[1] * 255}, ${c[2] * 255})`
                        }}
                    ></div>
                ))}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 50px)" }}>{monster.eyeScheme.map((c, index) => (
                    <div
                        key={index}
                        style={{
                            height: "50px",
                            width: "50px",
                            backgroundColor: `rgb(${c[0] * 255}, ${c[1] * 255}, ${c[2] * 255})`
                        }}
                    ></div>
                ))}</div>
            </div>
        </div>
    )
}
