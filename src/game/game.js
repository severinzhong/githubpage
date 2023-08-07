//gameEngin
export class Game{
    static instance ;
    frameRequest;
    tickQueue = [] ;

    constructor(){

        console.log(">>> game init check") ; 
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