import * as React from "react";
import {LinkMatchingResult, TextContext} from "../../../../pkg";
import {LinkMatchingResultComponent} from "../containers/LinkMatchingResultComponent";

interface LinkMatchSelectionComponentProps {
    linkMatchingResults: Array<LinkMatchingResult>,
}

export const LinkMatchingResultsListComponent = ({linkMatchingResults}: LinkMatchSelectionComponentProps) => {
    return (
        <div>
            <h2>Link Matches</h2>
            <ul>
                {linkMatchingResults.map((linkMatchingResult: LinkMatchingResult) => {
                    return <LinkMatchingResultComponent key={linkMatchingResult.note.path + "result"} linkMatchingResult={linkMatchingResult}/>
                })}
            </ul>
            <button>Replace</button>
        </div>
    );
};
