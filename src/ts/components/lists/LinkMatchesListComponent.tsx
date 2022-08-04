import * as React from "react";
import {LinkMatch, NoteMatchingResult} from "../../../../pkg";
import {LinkTargetCandidatesListComponent} from "./LinkTargetCandidatesListComponent";
import {NoteMatchingResultTitleComponent} from "../titles/NoteMatchingResultTitleComponent";
import {LinkMatchContext} from "../../context";

interface noteLinkMatchResultComponentProps {
    noteLinkMatchResult: NoteMatchingResult,
}

export const LinkMatchesListComponent = ({noteLinkMatchResult}: noteLinkMatchResultComponentProps) => {

    return (
        <li className={"link-matches-list"}>
            <NoteMatchingResultTitleComponent noteTitle={noteLinkMatchResult.note.title}
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