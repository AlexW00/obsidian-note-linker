import * as React from "react";
import {PreferrableItem, Replacement} from "../../../../pkg";
import {ReplacementItemComponent} from "../list-items/ReplacementItemComponent";
import {ReplacementCandidateContext} from "../../context";
import {useLinkTargetCandidate} from "../../hooks";
import {memo} from "react";


export const ReplacementsSelectionComponent = () => {
    const linkTargetCandidate = useLinkTargetCandidate();
    return (
        <li className={"replacements-selection"}>
            <span className={"title"}>🔗{linkTargetCandidate.path}</span>
            <ul className={"hide-list-styling"}>
                {linkTargetCandidate.replacementCandidates.map((replacementCandidate: PreferrableItem, index: number) =>
                    <ReplacementCandidateContext.Provider value={replacementCandidate}
                                                          key={`${replacementCandidate.content}-${index}`}>
                        <ReplacementItemComponent/>
                    </ReplacementCandidateContext.Provider>
                )}
            </ul>
        </li>
    );
};
