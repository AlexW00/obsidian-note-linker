import * as React from "react";
import {LinkMatch, LinkTargetCandidate, SelectionItem} from "../../../../pkg";
import {LinkMatchTitleComponent} from "../titles/LinkMatchTitleComponent";
import {ReplacementsSelectionComponent} from "../selections/ReplacementsSelectionComponent";


interface noteLinkMatchResultTextMatchProps {
    linkMatch: LinkMatch
    onLinkTargetCandidateSelected: (selectionItem: SelectionItem, linkMatch: LinkMatch, isSelected: boolean) => void
}

export const LinkTargetCandidatesListComponent = ({linkMatch, onLinkTargetCandidateSelected}: noteLinkMatchResultTextMatchProps) => {

    return (
        <div>
            <LinkMatchTitleComponent matchedText={linkMatch.matched_text} position={linkMatch.position}/>
            <ul>
                {linkMatch.link_match_target_candidate.map((linkTargetCandidate: LinkTargetCandidate) => {
                    return (
                        <ReplacementsSelectionComponent
                            linkTargetCandidate={linkTargetCandidate}
                            textContext={linkMatch.context}
                            key={linkTargetCandidate.path + "-replacementsSelection"}
                            onSelectionItemSelected={
                                (selectionItem: SelectionItem, isSelected: boolean) => onLinkTargetCandidateSelected(selectionItem, linkMatch, isSelected)
                            }
                        />
                    )
                })}
            </ul>
        </div>

    );
};