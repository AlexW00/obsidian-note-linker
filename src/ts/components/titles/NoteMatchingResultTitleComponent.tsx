import * as React from "react";

interface NoteMatchingResultTitleProps {
    noteTitle: string,
    notePath: string
}

export const NoteMatchingResultTitleComponent = ({noteTitle, notePath}: NoteMatchingResultTitleProps) => {

    return (
        <div className={"note-matching-result-title"}>
            <h3>{noteTitle}</h3>
            <span className={"light-description"}>{notePath}</span>
        </div>
    );
};