import * as React from "react";
import * as ReactDOM from "react-dom";
import {LinkTargetCandidate, SelectionItem, TextContext} from "../../../../pkg";
import {ReplacementItemComponent} from "../items/ReplacementItemComponent";
import {useContext, useState} from "react";
import {string} from "prop-types";
import {LinkTargetCandidateContext} from "../../context";


interface noteLinkMatchResultLinkMatchCandidateProps {
    textContext: TextContext
    onSelectionItemSelected: (selectionItem: SelectionItem, isSelected: boolean) => void
}

export const ReplacementsSelectionComponent = ({textContext, onSelectionItemSelected}: noteLinkMatchResultLinkMatchCandidateProps) => {

    const linkTargetCandidate = useContext(LinkTargetCandidateContext);
    return (
        <li className={"replacements-selection"}>
            <span className={"title"}>🔗{linkTargetCandidate.path}</span>
            <ul className={"hide-list-styling"}>
                {linkTargetCandidate.replacement_selection_items.map((replacement_selection_item: SelectionItem) => {
                    return (
                        <ReplacementItemComponent
                            targetNoteTitle={linkTargetCandidate.title}
                            targetNotePath={linkTargetCandidate.path}
                            textContext={textContext}
                            replacementSelectionItem = {replacement_selection_item}
                            key={replacement_selection_item.content + "-replacement"}
                            onSelect={ (isSelected) => onSelectionItemSelected(replacement_selection_item, isSelected) }
                        />
                    )
                })}
            </ul>
        </li>
    );
};
