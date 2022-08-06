import React from "react"

export const LoadingComponent = ({loadingText}: { loadingText: string }) => {

    const ASCII_ART_CARD = (String.raw`
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
`);
    return <div className={"loading-component"}>
        <h2>{loadingText}</h2>
        <span className={"multiline"}>{ASCII_ART_CARD}</span>
    </div>
}