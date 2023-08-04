import React, { useEffect, useRef } from "react";

// How to use 
// import {PWAInstallButton} from './utils/pwaInstaller'
// <PWAInstallButton />
export function PWAInstallButton(){

    const buttonRef = useRef()
    let installPrompt = null;


    async function PWAinstall(){
        if (!installPrompt) {
            return;
          }
          const result = await installPrompt.prompt();
          console.log(`Install prompt was: ${result.outcome}`);
          installPrompt = null;
          buttonRef.current.setAttribute("hidden", "");
    }

    useEffect(
    ()=>{
        
        if(window){
            window.addEventListener("beforeinstallprompt", (event) => {
                event.preventDefault();
                installPrompt = event;
                buttonRef.current.removeAttribute("hidden");
              });
        }
        if(buttonRef.current){    
            buttonRef.current.addEventListener("click",PWAinstall)
        }

        return ()=>{
            if(buttonRef.current)buttonRef.current.removeEventListener('click',PWAinstall)
        }
    }    
    ,[buttonRef])

    return (
        <button ref={buttonRef} hidden>Install</button>
    )
}