import React, { useState } from "react";
import { StartComponent } from "./StartComponent";
import { MatcherComponent } from "./MatcherComponent";

export enum MatchingMode {
	None,
	Vault,
	Note,
}

export const MainComponent = () => {
	const [matchingMode, setMatchingMode] = useState<MatchingMode>(
		MatchingMode.None
	);

	const onClickScan = (type: MatchingMode) => {
		setMatchingMode(type);
	};

	if (matchingMode == MatchingMode.None)
		return <StartComponent onClickScan={onClickScan} />;
	else return <MatcherComponent matchingMode={matchingMode} />;
};
