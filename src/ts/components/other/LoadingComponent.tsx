import React, {useEffect, useState} from "react"
import {AsciiArtLoadingAnimation} from "../../objects/AsciiArtLoadingAnimation";

export const LoadingComponent = ({loadingText}: {loadingText: string}) => {

    const ASCII_ART_CARD = `
  Note Link Matches  
┌───────────────────┐
│ ────              │
│ □ ──────────────  │
│ □ ──────────────  │
└───────────────────┘
┌───────────────────┐
│ ────              │
│ □ ──────────────  │
│ □ ──────────────  │
│ ────              │
│ □ ──────────────  │
└───────────────────┘
`
    const [loadingAnimation, setLoadingAnimation] = useState(new AsciiArtLoadingAnimation(ASCII_ART_CARD));

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingAnimation(loadingAnimation.next());
        } , 100);
        return () => {
            clearInterval(interval);
        }
    }, [loadingAnimation]);

    return <div className={"loading-component"}>
        <span>{loadingAnimation.getCurrentFrame()}</span>
        <span>{loadingText}</span>
    </div>
}