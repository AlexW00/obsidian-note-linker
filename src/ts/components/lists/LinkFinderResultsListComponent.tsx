import * as React from "react";
import {LinkFinderResult} from "../../../../pkg";
import {LinkMatchesListComponent} from "./LinkMatchesListComponent";
import {LinkFinderResultContext} from "../../context";

interface LinkFinderResultsListProps {
    linkFinderResults: Array<LinkFinderResult>,
    onClickReplaceButton: () => void
}

export const LinkFinderResultsList = ({linkFinderResults, onClickReplaceButton}: LinkFinderResultsListProps) => {
    if (linkFinderResults.length !== 0) return (
        <div className="note-matching-result-list">
            <h2>Note Link Matches</h2>
            <ul className={"hide-list-styling"}>
                {linkFinderResults.map((linkFinderResult: LinkFinderResult) =>
                    <LinkFinderResultContext.Provider value={linkFinderResult}
                                                        key={`${linkFinderResult.note.path}`}>
                        <LinkMatchesListComponent
                            linkFinderResult={linkFinderResult}
                        />
                    </LinkFinderResultContext.Provider>
                )}
            </ul>
            <button onClick={onClickReplaceButton}>🔗 Link selected</button>
        </div>
    );
    else return (
        <div className={"info-toast"}>👀 No notes to link could be found.</div>
    )
};
