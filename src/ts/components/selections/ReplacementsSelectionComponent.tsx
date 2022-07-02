import * as React from "react";
import * as ReactDOM from "react-dom";
import {LinkTargetCandidate, SelectionItem, TextContext} from "../../../../pkg";
import {ReplacementItemComponent} from "../items/ReplacementItemComponent";
import {useState} from "react";
import {string} from "prop-types";


interface noteLinkMatchResultLinkMatchCandidateProps {
    linkTargetCandidate: LinkTargetCandidate
    textContext: TextContext
    onSelectionItemSelected: (selectionItem: SelectionItem) => void
}

export const ReplacementsSelectionComponent = ({linkTargetCandidate, textContext, onSelectionItemSelected}: noteLinkMatchResultLinkMatchCandidateProps) => {

    return (
        <li className={"replacements-selection"}>
            <span className={"title"}>🔗{linkTargetCandidate.path}</span>
            <ul className={"hide-list-styling"}>
                {linkTargetCandidate.replacement_selection_items.map((replacement_selection_item: SelectionItem) => {
                    return (
                        <ReplacementItemComponent
                            targetNoteTitle={linkTargetCandidate.title}
                            textContext={textContext}
                            replacementSelectionItem = {replacement_selection_item}
                            key={replacement_selection_item.content + "-replacement"}
                            onSelect={ () => onSelectionItemSelected(replacement_selection_item) }
                        />
                    )
                })}
            </ul>
        </li>
    );
};
