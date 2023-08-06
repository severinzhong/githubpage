# 项目介绍

实验项目用于实践react,PWA,js在github pages的应用

[github pages](https://severinzhong.github.io/githubpage/)

## 组件介绍

### Timer

一个简单的计时器组件，用来实践基础功能,尝试requstAniamtionFrame

### FullscreenButton

确认是否具备全屏能力（手机下似乎会自动横屏，还需要修改[TODO]）

### UTCTime

获取国际标准时间，确认github page是否具备接受发送请求的能力。

### PWAInstallButton

一个请求PWA安装到桌面的按钮，实验是否具备主动安装能力（PWA在首次网站入后会自动询问用户，可以不使用此按钮）

### OverlayPage

一个遮罩页面配合一个进入和关闭的按钮，实现多个应用在同一个页面上实现和使用。

使用方法：

```js
<OverlayPage name="Get UTC !" component={<UTCTime />}/>
```
### TodoList

实验本地存储能力,实验css felx布局

## 踩坑记录

### npm run deploy 失败

Failed to get remote.origin.url (task must either be run in a git repository with a configured origin remote or must be configured with the "repo" option).

[gh-pages issues #443](https://github.com/tschaub/gh-pages/issues/443)

当你使用移动硬盘来装载项目的时候，会被git认为不是安全地址，需要在本地部署或者使用git的safe directory

### Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.

```html
<button onClick={toggleFullscreen}>Fullscreen</button> //报错
```

```js
fullscreenButton.addEventListener("click",toggleFullscreen);  //成功
```

全屏操作不能用onclick在组件上进行绑定，会被浏览器认为是不合法行为

另外，使用useEffect之后onClick必然失败，只能使用addEventListener，不确定原因，暂时记下

### Failed to execute 'prompt' on 'BeforeInstallPromptEvent': The prompt() method must be called with a user gesture

PWA 安装至主页，绑定按钮报错，已经按照教程进行了，但是调试依旧报错（但是手机PC都能正确安装，先不管了）

```js
installButton.addEventListener("click", async () => {
      if (!installPrompt) {
        return;
      }
      const result = await installPrompt.prompt();
      console.log(`Install prompt was: ${result.outcome}`);
      installPrompt = null;
      installButton.setAttribute("hidden", "");
    });
```

## :root属性选择器

```css
:root {
  --aspect-ratio : calc(3/4) ;
  --base-w: 1vw ; /* 基础值 保持3/4的屏幕比*/
  --base-h: calc(1vw / var(--aspect-ratio)) ;
  @media (min-aspect-ratio: 3/4){
      --base-w : calc(1vh *var(--aspect-ratio)) ; 
      --base-h : 1vh ;
  }
}
```
属性选择器:root以最子节点的属性为准，min-aspect-ratio: 只能用3/4不能用calc(3/4)

### 状态更新

```js
const dpsFn = function (delta) {
    setDamage((prevDamage) => prevDamage + delta); 
    // 使用函数形式更新状态，确保正确更新
  };
const dpsFn = function (delta){ 
        setDamage(damage + delta );
        //函数组件中，状态更新是异步的，并且在更新函数被调用之后，并不立即改变状态值。这导致多个更新操作实际上是基于相同的初始状态进行计算，因此只有最后一次更新会应用到状态上。
    }

```

