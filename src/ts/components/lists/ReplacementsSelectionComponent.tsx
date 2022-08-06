import * as React from "react";
import {PreferrableItem, Replacement} from "../../../../pkg";
import {ReplacementItemComponent} from "../list-items/ReplacementItemComponent";
import {useLinkTargetCandidate} from "../../hooks";


interface ReplacementsSelectionComponentProps {
    selectedReplacement: Replacement,
    setSelectedReplacement: React.Dispatch<React.SetStateAction<Replacement>>
}

export const ReplacementsSelectionComponent = ({
                                                   selectedReplacement,
                                                   setSelectedReplacement
                                               }: ReplacementsSelectionComponentProps) => {
    const linkTargetCandidate = useLinkTargetCandidate();
    return (
        <li className={"replacements-selection"}>
            <span className={"title"}>🔗{linkTargetCandidate.path}</span>
            <ul className={"hide-list-styling"}>
                {linkTargetCandidate.replacementCandidates.map((replacementCandidate: PreferrableItem, index: number) =>
                    <ReplacementItemComponent selectedReplacement={selectedReplacement}
                                              setSelectedReplacement={setSelectedReplacement}
                                              replacementCandidate={replacementCandidate}
                                              key={`${replacementCandidate.content}-${index}`}
                    />
                )}
            </ul>
        </li>
    );
};
