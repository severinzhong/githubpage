# 项目介绍

实验项目用于实践react,PWA,js在github pages的应用

[github pages](https://severinzhong.github.io/githubpage/)

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

