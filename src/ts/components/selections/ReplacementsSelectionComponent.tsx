import * as React from "react";
import * as ReactDOM from "react-dom";
import {LinkTargetCandidate, SelectionItem, TextContext} from "../../../../pkg";
import {ReplacementItemComponent} from "../items/ReplacementItemComponent";
import {useState} from "react";
import {string} from "prop-types";


interface noteLinkMatchResultLinkMatchCandidateProps {
    linkTargetCandidate: LinkTargetCandidate
    textContext: TextContext
    onSelectionItemSelected: (selectionItem: SelectionItem, isSelected: boolean) => void
}

export const ReplacementsSelectionComponent = ({linkTargetCandidate, textContext, onSelectionItemSelected}: noteLinkMatchResultLinkMatchCandidateProps) => {

    return (
        <li>
            <span>
                🔗{linkTargetCandidate.path}
            </span>
            <ul>
                {linkTargetCandidate.replacement_selection_items.map((replacement_selection_item: SelectionItem) => {
                    return (
                        <ReplacementItemComponent
                            targetNoteTitle={linkTargetCandidate.title}
                            textContext={textContext}
                            replacementSelectionItem = {replacement_selection_item}
                            key={replacement_selection_item.content + "-replacement"}
                            // TODO: use isSelected
                            onSelectionChanged={ (isSelected: boolean) => onSelectionItemSelected(replacement_selection_item, isSelected) }
                        />
                    )
                })}
            </ul>
        </li>
    );
};
