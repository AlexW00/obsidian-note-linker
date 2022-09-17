import * as React from "react";
import Progress from "../../objects/Progress";

interface LinkMatcherProgressComponentProps {
	progress: Progress;
}

export const ProgressComponent = ({
	progress,
}: LinkMatcherProgressComponentProps) => {
	return (
		<div className={"progress-bar-component"}>
			<h2>🔎 Scanning notes...</h2>
			<span className={"ascii-art-progress-bar"}>{progress.asAsciiArt()}</span>
			<span className={"light-description"}>
				{progress.asDescriptionText()}
			</span>
		</div>
	);
};
