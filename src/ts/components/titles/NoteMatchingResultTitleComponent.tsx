import * as React from "react";
import * as ReactDOM from "react-dom";

interface NoteMatchingResultTitleProps {
    noteTitle: string,
    notePath: string
}

export const NoteMatchingResultTitleComponent = ({noteTitle, notePath}: NoteMatchingResultTitleProps) => {

    return (
        <div>
            <h4>{noteTitle}</h4>
            <span>{notePath}</span>
        </div>
    );
};