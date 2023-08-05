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
        <button className="OverlayPageButton" onClick={handleClick}>
          {props.name ? props.name : props.component.type.name}
        </button>
        {showOverlay && (
          <div className="OverlayPage">
              {props.component}
              <button className="OverlayPagecloseButton" onClick={handleClose}>X</button>
          </div>)}
      </div>
    );
  }