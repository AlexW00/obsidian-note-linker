import * as React from "react";
import {LinkMatch, LinkTargetCandidate, SelectionItem} from "../../../../pkg";
import {LinkMatchTitleComponent} from "../titles/LinkMatchTitleComponent";
import {ReplacementsSelectionComponent} from "../selections/ReplacementsSelectionComponent";
import {useContext, useEffect, useState} from "react";
import {LinkMatchContext, LinkTargetCandidateContext} from "../../context";


interface noteLinkMatchResultTextMatchProps {
    onLinkTargetCandidateSelected: (selectionItem: SelectionItem, candidate: LinkTargetCandidate, isSelected: boolean) => void
}

export const LinkTargetCandidatesListComponent = ({onLinkTargetCandidateSelected}: noteLinkMatchResultTextMatchProps) => {

    const linkMatch = useContext(LinkMatchContext);
    const [linkMatchTargetCandidates, setLinkMatchTargetCandidates] = useState<Array<LinkTargetCandidate>>(linkMatch.link_match_target_candidate);

    const handleItemSelection = (selectionItem: SelectionItem, candidate: LinkTargetCandidate, isSelected: boolean) => {
        console.log("handleItemSelection", selectionItem, candidate);
        const newLinkMatchTargetCandidates = linkMatchTargetCandidates.map( (linkMatchTargetCandidate: LinkTargetCandidate) => {
            linkMatchTargetCandidate.replacement_selection_items.forEach((item: SelectionItem) => {
                console.log(`Selection item: ${selectionItem.to_json_string()}, item: ${item.to_json_string()}`);
                if (item != selectionItem) item.is_selected = false;
                else item.is_selected = !item.is_selected;
                console.log(`Selection item: ${selectionItem.to_json_string()}, item: ${item.to_json_string()}`);
            });
            return linkMatchTargetCandidate
            }
        )
        setLinkMatchTargetCandidates(newLinkMatchTargetCandidates);
        onLinkTargetCandidateSelected(selectionItem, candidate, isSelected)
    }
    return (
        <div className={"link-target-candidates-list"}>
            <LinkMatchTitleComponent matchedText={linkMatch.matched_text} position={linkMatch.position}/>
            <ul className={"hide-list-styling"}>
                {linkMatch.link_match_target_candidate.map((linkTargetCandidate: LinkTargetCandidate) => {
                    return (
                        <LinkTargetCandidateContext.Provider value={linkTargetCandidate}>
                            <ReplacementsSelectionComponent
                                textContext={linkMatch.context}
                                key={linkTargetCandidate.path + "-replacementsSelection"}
                                onSelectionItemSelected={
                                    (selectionItem: SelectionItem, isSelected) => handleItemSelection(selectionItem, linkTargetCandidate, isSelected)
                                }
                            />
                        </LinkTargetCandidateContext.Provider>
                    )
                })}
            </ul>
        </div>

    );
};