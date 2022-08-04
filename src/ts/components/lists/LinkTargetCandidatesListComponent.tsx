import * as React from "react";
import {LinkTargetCandidate} from "../../../../pkg";
import {LinkMatchTitleComponent} from "../titles/LinkMatchTitleComponent";
import {ReplacementsSelectionComponent} from "../selections/ReplacementsSelectionComponent";
import {LinkTargetCandidateContext} from "../../context";
import {useLinkMatch} from "../../hooks";


export const LinkTargetCandidatesListComponent = () => {

    const linkMatch = useLinkMatch();

    return (
        <div className={"link-target-candidates-list"}>
            <LinkMatchTitleComponent matchedText={linkMatch.matchedText} position={linkMatch.position}/>
            <ul className={"hide-list-styling"}>
                {linkMatch.linkMatchTargetCandidates.map((linkTargetCandidate: LinkTargetCandidate) =>
                    <LinkTargetCandidateContext.Provider value={linkTargetCandidate}
                                                         key={`${linkTargetCandidate.path}`}>
                        <ReplacementsSelectionComponent/>
                    </LinkTargetCandidateContext.Provider>
                )}
            </ul>
        </div>
    );
};