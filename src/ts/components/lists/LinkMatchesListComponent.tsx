import * as React from "react";
import {LinkMatch, NoteMatchingResult} from "../../../../pkg";
import {LinkTargetCandidatesListComponent} from "./LinkTargetCandidatesListComponent";
import {NoteMatchingResultTitleComponent} from "../titles/NoteMatchingResultTitleComponent";

interface noteLinkMatchResultComponentProps {
    noteLinkMatchResult: NoteMatchingResult,
}

export const LinkMatchesListComponent = ({noteLinkMatchResult}: noteLinkMatchResultComponentProps) => {

    return (
        <li>
            <NoteMatchingResultTitleComponent noteTitle={noteLinkMatchResult.note.title} notePath={noteLinkMatchResult.note.path}/>
            <ul>
                {noteLinkMatchResult.link_matches.map((link_match: LinkMatch) => {
                    return (
                        <LinkTargetCandidatesListComponent
                            linkMatch={link_match}
                            key={`${link_match.matched_text}-${link_match.position.start}-${link_match.position.end}`}/>
                    )
                })}
            </ul>
        </li>
    );
};