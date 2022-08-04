import * as React from "react";

interface LinkFinderResultTitleProps {
    noteTitle: string,
    notePath: string
}

export const LinkFinderResultTitleComponent = ({noteTitle, notePath}: LinkFinderResultTitleProps) => {

    return (
        <div className={"note-matching-result-title"}>
            <h3>{noteTitle}</h3>
            <span className={"light-description"}>{notePath}</span>
        </div>
    );
};