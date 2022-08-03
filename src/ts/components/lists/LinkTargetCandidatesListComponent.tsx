import * as React from "react";
import {LinkMatch, LinkTargetCandidate, SelectionItem} from "../../../../pkg";
import {LinkMatchTitleComponent} from "../titles/LinkMatchTitleComponent";
import {ReplacementsSelectionComponent} from "../selections/ReplacementsSelectionComponent";
import {useContext} from "react";
import {LinkMatchContext, LinkTargetCandidateContext} from "../../context";


interface noteLinkMatchResultTextMatchProps {
    onLinkTargetCandidateSelected: (selectionItem: SelectionItem, candidate: LinkTargetCandidate, isSelected: boolean) => void
}

export const LinkTargetCandidatesListComponent = ({onLinkTargetCandidateSelected}: noteLinkMatchResultTextMatchProps) => {
    const linkMatch = useContext(LinkMatchContext);

    return (
        <div className={"link-target-candidates-list"}>
            <LinkMatchTitleComponent matchedText={linkMatch.matched_text} position={linkMatch.position}/>
            <ul className={"hide-list-styling"}>
                {linkMatch.link_match_target_candidate.map((linkTargetCandidate: LinkTargetCandidate) => {
                    return (
                        <LinkTargetCandidateContext.Provider value={linkTargetCandidate}>
                            <ReplacementsSelectionComponent
                                key={linkTargetCandidate.path + "-replacementsSelection"}
                                onSelectionItemSelected={
                                    (selectionItem: SelectionItem, isSelected) => onLinkTargetCandidateSelected(selectionItem, linkTargetCandidate, isSelected)
                                }
                            />
                        </LinkTargetCandidateContext.Provider>
                    )
                })}
            </ul>
        </div>

    );
};