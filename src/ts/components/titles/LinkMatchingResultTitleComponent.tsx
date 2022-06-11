import * as React from "react";
import * as ReactDOM from "react-dom";

interface LinkMatchingResultTitleComponentProps {
    noteTitle: string,
    notePath: string
}

export const LinkMatchingResultTitleComponent = ({noteTitle, notePath}: LinkMatchingResultTitleComponentProps) => {

    return (
        <div>
            <h4>{noteTitle}</h4>
            <span>{notePath}</span>
        </div>
    );
};