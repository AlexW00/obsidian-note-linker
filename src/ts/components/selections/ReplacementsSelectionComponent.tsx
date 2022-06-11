import * as React from "react";
import * as ReactDOM from "react-dom";
import {LinkTargetCandidate, TextContext} from "../../../../pkg";
import {ReplacementItemComponent} from "../items/ReplacementItemComponent";


interface noteLinkMatchResultLinkMatchCandidateProps {
    linkTargetCandidate: LinkTargetCandidate
    textContext: TextContext
}

export const ReplacementsSelectionComponent = ({linkTargetCandidate, textContext}: noteLinkMatchResultLinkMatchCandidateProps) => {

    return (
        <li>
            <span>
                🔗{linkTargetCandidate.path}
            </span>
            <ul>
                {[linkTargetCandidate.title, ...linkTargetCandidate.aliases].map((replacement: string) => {
                    return (
                        <ReplacementItemComponent
                            replacement={replacement}
                            targetNoteTitle={linkTargetCandidate.title}
                            textContext={textContext}
                            key={replacement + "-replacement"}
                        />
                    )
                })}
            </ul>
        </li>
    );
};
