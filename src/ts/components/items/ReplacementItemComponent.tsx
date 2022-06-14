import * as React from "react";
import * as ReactDOM from "react-dom";
import {SelectionItem, TextContext} from "../../../../pkg";
import {ReactEventHandler, useState} from "react";

interface noteLinkMatchResultLinkMatchCandidateReplacementProps {
    targetNoteTitle: string
    textContext: TextContext
    onSelectionChanged: (isSelected: boolean) => void
    replacementSelectionItem: SelectionItem
}

export const ReplacementItemComponent = ({replacementSelectionItem, targetNoteTitle, textContext, onSelectionChanged}: noteLinkMatchResultLinkMatchCandidateReplacementProps) => {

    const [isSelected, setSelected] = useState(replacementSelectionItem.is_selected);
    if (isSelected) onSelectionChanged(isSelected); // init the note change operations

    return (
        <li className={"replacement-item"}>

            <input
                className={"checkbox"}
                type={"checkbox"}
                checked={isSelected}
                onChange={() => {
                    setSelected(!isSelected);
                    onSelectionChanged(!isSelected);
                }}
            />
            <span className={"replacement-text"}>
                {replacementSelectionItem.content}
            </span>
            <span className={"replacement-context"}>
                "→ {textContext.left_context_tail.text}{generateMockupMdLink(replacementSelectionItem.content, targetNoteTitle)}{textContext.right_context_tail.text}"
            </span>
        </li>
    );
};

const isAlias = (replacement: string, targetNoteTitle: string) : boolean => {
    return replacement != targetNoteTitle;
}

const generateMockupMdLink = (replacement: string, targetNoteTitle: string) : string => {
    return  isAlias(replacement, targetNoteTitle)
        ? `[[${targetNoteTitle}|${replacement}]]`
        : `[[${replacement}]]`;
}