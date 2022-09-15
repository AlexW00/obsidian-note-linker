import React, { useState } from "react";
import { StartComponent } from "./StartComponent";
import { MatcherComponent } from "./MatcherComponent";

export enum MatchingMode {
	None,
	Vault,
	Note,
}

export interface MainComponentProps {
	_matchingMode: MatchingMode;
}

export const MainComponent = ({ _matchingMode }: MainComponentProps) => {
	const [matchingMode, setMatchingMode] = useState<MatchingMode>(_matchingMode);

	const onClickScan = (type: MatchingMode) => {
		setMatchingMode(type);
	};

	if (matchingMode == MatchingMode.None)
		return <StartComponent onClickScan={onClickScan} />;
	else return <MatcherComponent matchingMode={matchingMode} />;
};
