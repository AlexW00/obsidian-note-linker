import * as React from "react";
import * as ReactDOM from "react-dom";
import {LinkTargetCandidate, TextContext} from "../../../../pkg";
import {ReplacementItemComponent} from "../items/ReplacementItemComponent";


interface noteLinkMatchResultLinkMatchCandidateProps {
    linkTargetCandidate: LinkTargetCandidate
    textContext: TextContext
    isPrimary: boolean
}

export const ReplacementsSelectionComponent = ({linkTargetCandidate, textContext, isPrimary}: noteLinkMatchResultLinkMatchCandidateProps) => {
    console.log(linkTargetCandidate.selected_index);
    return (
        <li>
            <span>
                🔗{linkTargetCandidate.path}
            </span>
            <ul>
                {[linkTargetCandidate.title, ...linkTargetCandidate.aliases].map((replacement: string, index: number) => {
                    return (
                        <ReplacementItemComponent
                            replacement={replacement}
                            targetNoteTitle={linkTargetCandidate.title}
                            textContext={textContext}
                            isSelected={(index === linkTargetCandidate.selected_index) && isPrimary}
                            key={replacement + "-replacement"}
                            onSelect={ (e) => {console.log("selected", e)}}
                        />
                    )
                })}
            </ul>
        </li>
    );
};
