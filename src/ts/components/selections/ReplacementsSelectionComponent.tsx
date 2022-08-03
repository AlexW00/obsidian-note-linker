import * as React from "react";
import * as ReactDOM from "react-dom";
import {LinkTargetCandidate, SelectionItem, TextContext} from "../../../../pkg";
import {ReplacementItemComponent} from "../items/ReplacementItemComponent";
import {useContext, useState} from "react";
import {string} from "prop-types";
import {LinkTargetCandidateContext, SelectionItemContext} from "../../context";


interface noteLinkMatchResultLinkMatchCandidateProps {
    onSelectionItemSelected: (selectionItem: SelectionItem, isSelected: boolean) => void
}

export const ReplacementsSelectionComponent = ({onSelectionItemSelected}: noteLinkMatchResultLinkMatchCandidateProps) => {

    const linkTargetCandidate = useContext(LinkTargetCandidateContext);
    return (
        <li className={"replacements-selection"}>
            <span className={"title"}>🔗{linkTargetCandidate.path}</span>
            <ul className={"hide-list-styling"}>
                {linkTargetCandidate.selectionItems.map((replacement_selection_item: SelectionItem) => {
                    return (
                        <SelectionItemContext.Provider value={replacement_selection_item}>
                            <ReplacementItemComponent
                                key={replacement_selection_item.content + "-replacement"}
                                onSelect={ (isSelected) => onSelectionItemSelected(replacement_selection_item, isSelected) }
                            />
                        </SelectionItemContext.Provider>
                    )
                })}
            </ul>
        </li>
    );
};
