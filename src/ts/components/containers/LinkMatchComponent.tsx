import * as React from "react";
import * as ReactDOM from "react-dom";
import {LinkMatch, LinkMatchingResult, LinkMatchTargetCandidate} from "../../../../pkg";
import {LinkMatchTitleComponent} from "../titles/LinkMatchTitleComponent";
import {LinkMatchingResultComponent} from "./LinkMatchingResultComponent";
import {LinkMatchTargetCandidateSelectionComponent} from "../selection/LinkMatchTargetCandidateSelectionComponent";


interface LinkMatchingResultTextMatchProps {
    linkMatch: LinkMatch
}

export const LinkMatchComponent = ({linkMatch}: LinkMatchingResultTextMatchProps) => {

    return (
        <div>
            <LinkMatchTitleComponent matchedText={linkMatch.matched_text} position={linkMatch.position}/>
            <ul>
                {linkMatch.link_match_target_candidate.map((linkMatchTargetCandidate: LinkMatchTargetCandidate) => {
                    return (
                        <LinkMatchTargetCandidateSelectionComponent
                            linkMatchTargetCandidate={linkMatchTargetCandidate}
                            textContext={linkMatch.context}
                            key={linkMatchTargetCandidate.path + "match"}
                        />
                    )
                })}
            </ul>
        </div>

    );
};