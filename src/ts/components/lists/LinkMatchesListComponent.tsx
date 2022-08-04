import * as React from "react";
import {LinkMatch, LinkFinderResult} from "../../../../pkg";
import {LinkTargetCandidatesListComponent} from "./LinkTargetCandidatesListComponent";
import {LinkFinderResultTitleComponent} from "../titles/LinkFinderResultTitleComponent";
import {LinkMatchContext} from "../../context";

interface noteLinkMatchResultComponentProps {
    noteLinkMatchResult: LinkFinderResult,
}

export const LinkMatchesListComponent = ({noteLinkMatchResult}: noteLinkMatchResultComponentProps) => {

    return (
        <li className={"link-matches-list"}>
            <LinkFinderResultTitleComponent noteTitle={noteLinkMatchResult.note.title}
                                              notePath={noteLinkMatchResult.note.path}/>
            <ul className={"hide-list-styling"}>
                {noteLinkMatchResult.linkMatches.map((link_match: LinkMatch) =>
                    <LinkMatchContext.Provider value={link_match}
                                               key={`${link_match.position.start}-${link_match.position.end}`}>
                        <LinkTargetCandidatesListComponent/>
                    </LinkMatchContext.Provider>
                )}
            </ul>
        </li>
    );
};