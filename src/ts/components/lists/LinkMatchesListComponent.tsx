import * as React from "react";
import {LinkMatch, LinkFinderResult} from "../../../../pkg";
import {LinkTargetCandidatesListComponent} from "./LinkTargetCandidatesListComponent";
import {LinkFinderResultTitleComponent} from "../titles/LinkFinderResultTitleComponent";
import {LinkMatchContext} from "../../context";

interface linkFinderResultComponentProps {
    linkFinderResult: LinkFinderResult,
}

export const LinkMatchesListComponent = ({linkFinderResult}: linkFinderResultComponentProps) => {

    return (
        <li className={"link-matches-list"}>
            <LinkFinderResultTitleComponent noteTitle={linkFinderResult.note.title}
                                              notePath={linkFinderResult.note.path}/>
            <ul className={"hide-list-styling"}>
                {linkFinderResult.linkMatches.map((link_match: LinkMatch) =>
                    <LinkMatchContext.Provider value={link_match}
                                               key={`${link_match.position.start}-${link_match.position.end}`}>
                        <LinkTargetCandidatesListComponent/>
                    </LinkMatchContext.Provider>
                )}
            </ul>
        </li>
    );
};