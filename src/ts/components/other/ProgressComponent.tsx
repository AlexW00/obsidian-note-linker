import * as React from "react";
import Progress from "../../objects/Progress";

interface LinkMatcherProgressComponentProps {
    progress: Progress
}

export const ProgressComponent = ({progress}: LinkMatcherProgressComponentProps) => {
    // TODO: Better progress
    return (
        <span>
            Progress: {progress.current} of {progress.max}
        </span>
    );
};