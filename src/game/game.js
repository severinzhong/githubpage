



class Game{

    frameRequest;

    constructor(){
        this.start();
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



    }
}