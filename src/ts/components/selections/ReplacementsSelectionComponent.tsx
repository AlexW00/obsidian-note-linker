import * as React from "react";
import * as ReactDOM from "react-dom";
import {LinkTargetCandidate, SelectionItem, TextContext} from "../../../../pkg";
import {ReplacementItemComponent} from "../items/ReplacementItemComponent";
import {useState} from "react";
import {string} from "prop-types";


interface noteLinkMatchResultLinkMatchCandidateProps {
    linkTargetCandidate: LinkTargetCandidate
    textContext: TextContext
    isPrimary: boolean
}

export const ReplacementsSelectionComponent = ({linkTargetCandidate, textContext, isPrimary}: noteLinkMatchResultLinkMatchCandidateProps) => {

    return (
        <li>
            <span>
                🔗{linkTargetCandidate.path}
            </span>
            <ul>
                {linkTargetCandidate.replacement_selection_items.map((replacement_selection_item: SelectionItem) => {
                    // De-select any items that aren't from the first matching group
                    if (!isPrimary) replacement_selection_item.is_selected = false;
                    return (
                        <ReplacementItemComponent
                            replacement={replacement_selection_item.content}
                            targetNoteTitle={linkTargetCandidate.title}
                            textContext={textContext}
                            isSelected={replacement_selection_item.is_selected}
                            key={replacement_selection_item.content + "-replacement"}
                            onChange={ (e) => {
                                console.log("changed", e);
                                replacement_selection_item.is_selected = true;
                            }}
                        />
                    )
                })}
            </ul>
        </li>
    );
};
