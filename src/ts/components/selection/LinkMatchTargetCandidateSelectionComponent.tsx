import * as React from "react";
import * as ReactDOM from "react-dom";
import {LinkMatchTargetCandidate, TextContext} from "../../../../pkg";
import {LinkMatchTargetCandidateReplacementComponent} from "../items/LinkMatchTargetCandidateReplacementComponent";


interface LinkMatchingResultLinkMatchCandidateProps {
    linkMatchTargetCandidate: LinkMatchTargetCandidate
    textContext: TextContext
}

export const LinkMatchTargetCandidateSelectionComponent = ({linkMatchTargetCandidate, textContext}: LinkMatchingResultLinkMatchCandidateProps) => {

    return (
        <div>
            <span>
                🔗{linkMatchTargetCandidate.path}
            </span>
            <ul>
                {[linkMatchTargetCandidate.title, ...linkMatchTargetCandidate.aliases].map((replacement: string) => {
                    return (
                        <LinkMatchTargetCandidateReplacementComponent
                            replacement={replacement}
                            targetNoteTitle={linkMatchTargetCandidate.title}
                            textContext={textContext}
                        />
                    )
                })}
            </ul>
        </div>
    );
};
