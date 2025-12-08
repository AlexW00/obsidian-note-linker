import React, { useState } from "react";
import { StartComponent } from "./StartComponent";
import { MatcherComponent } from "./MatcherComponent";
import { NoteLinkerSettings } from "../../../settings";

export enum MatchingMode {
	None,
	Vault,
	Note,
}

export interface MainComponentProps {
	_matchingMode: MatchingMode;
	settings: NoteLinkerSettings;
}

export const MainComponent = ({ _matchingMode, settings }: MainComponentProps) => {
	const [matchingMode, setMatchingMode] = useState<MatchingMode>(_matchingMode);

	const onClickScan = (type: MatchingMode) => {
		setMatchingMode(type);
	};

	if (matchingMode == MatchingMode.None)
		return <StartComponent onClickScan={onClickScan} />;
	else return <MatcherComponent matchingMode={matchingMode} settings={settings} />;
};
