import React from "react";
import {useState} from "react";
import {StartComponent} from "./StartComponent";
import {MatcherComponent} from "./MatcherComponent";

enum MainComponentStates {
    Start,
    Matching
}

export const MainComponent = () => {
    const [mainComponentState, setMainComponentState] = useState<MainComponentStates>(MainComponentStates.Start);

    const onClickScan = () => {
        setMainComponentState(MainComponentStates.Matching)
    }

    if (mainComponentState == MainComponentStates.Start) return <StartComponent onClickScan={onClickScan}/>
    else return <MatcherComponent />
}