import '../styles/main.css'
import { FaSignal } from "react-icons/fa6";
import { MdOutlineWifi } from "react-icons/md";
import { IoIosBatteryFull } from "react-icons/io";

import App from '../App'
import { useState } from 'react';

export default function HomeComponent() {
    const [clicked, setClicked] = useState(false)

    const animate_bar = () => {
        setClicked(true)

        setTimeout(() => {
           setClicked(false) 
        }, 200);
    }
    return (
        <>
        <div className='outer-container'>
            <h2 className="cta-title">
                Try It Now
            </h2>
            <div className="phone-container-main">
                <div className="overlay">
                    <div className="top-hud">
                        <div className="not-island">
                            <div className="phone-time">9:41</div>
                            <div className="icons">
                                <FaSignal />
                                <MdOutlineWifi />
                                <IoIosBatteryFull className='battery'/>
                            </div>
                        </div>
                        <div className="dynamic-island">
                            <div className="recording-true"></div>
                            <div className="camera-lens">
                                <div className="lens-inner"></div>
                            </div>
                        </div>
                    </div>
                    <div className={`home-nav-bar ${clicked ? "animate" : ""}`} onClick={()=> animate_bar()}></div>
                </div>
                <div className="app-outer">
                    <App />
                </div>
            </div>
            <p className="warning-text">Some features may not be available.</p>
        </div>
        </>
    )
}