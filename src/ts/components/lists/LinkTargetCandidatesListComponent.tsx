import * as React from "react";
import {LinkMatch, LinkTargetCandidate, SelectionItem} from "../../../../pkg";
import {LinkMatchTitleComponent} from "../titles/LinkMatchTitleComponent";
import {ReplacementsSelectionComponent} from "../selections/ReplacementsSelectionComponent";
import {useEffect, useState} from "react";


interface noteLinkMatchResultTextMatchProps {
    linkMatch: LinkMatch
    onLinkTargetCandidateSelected: (selectionItem: SelectionItem, candidate: LinkTargetCandidate) => void
}

export const LinkTargetCandidatesListComponent = ({linkMatch, onLinkTargetCandidateSelected}: noteLinkMatchResultTextMatchProps) => {

    const [linkMatchTargetCandidates, setLinkMatchTargetCandidates] = useState<Array<LinkTargetCandidate>>(linkMatch.link_match_target_candidate);

    const handleItemSelection = (selectionItem: SelectionItem, candidate: LinkTargetCandidate) => {
        const newLinkMatchTargetCandidates = linkMatchTargetCandidates.map( (linkMatchTargetCandidate: LinkTargetCandidate) => {
            linkMatchTargetCandidate.replacement_selection_items.forEach((item: SelectionItem) => {
                if (item != selectionItem) item.is_selected = false;
                else item.is_selected = !item.is_selected;
            });
            return linkMatchTargetCandidate
            }
        )
        setLinkMatchTargetCandidates(newLinkMatchTargetCandidates);
        onLinkTargetCandidateSelected(selectionItem, candidate)
    }
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
                                (selectionItem: SelectionItem) => handleItemSelection(selectionItem, linkTargetCandidate)
                            }
                        />
                    )
                })}
            </ul>
        </div>

    );
};