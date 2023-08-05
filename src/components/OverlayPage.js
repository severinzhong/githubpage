import React,{useState} from "react";
import '../styles/OverlayPage.css'

export function OverlayPage(props) {
    const [showOverlay, setShowOverlay] = useState(false);
  
    const handleClick = () => {
      setShowOverlay(true);
    };
  
    const handleClose = () => {
      setShowOverlay(false);
    };
  
    return (
      <div>
        <button className="OverlayPageButton" onClick={handleClick}>{props.name}</button>
        {showOverlay && (
          <div className="OverlayPage">
              <div>{props.component}</div>
              <div> 
                  <button className="OverlayPagecloseButton" onClick={handleClose}>X</button>
              </div>
          </div>)}
      </div>
    );
  }