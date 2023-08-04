// 判断当前是否全屏
function isFullscreen() {
    return document.fullscreenElement 
    || document.mozFullScreenElement 
    || document.webkitFullscreenElement 
    || document.msFullscreenElement;
}

// 进入全屏模式
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

// 退出全屏模式
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// add to listenner
export function toggleFullscreen() {
    if (isFullscreen()) {
            exitFullscreen();
            console.log("退出全屏");
        } else {
            enterFullscreen(document.documentElement);
            console.log("进入全屏");
        }
}