import * as React from "react";
import * as ReactDOM from "react-dom";
import {Note, NoteMatchingResult, SelectionItem, TextContext} from "../../../../pkg";
import {ReactEventHandler, useEffect, useState} from "react";
import JsNote from "../../JsNote";
import * as wasm from "../../../../pkg";

interface noteLinkMatchResultLinkMatchCandidateReplacementProps {
    targetNoteTitle: string
    textContext: TextContext
    onSelect: () => void
    replacementSelectionItem: SelectionItem
}

export const ReplacementItemComponent = ({replacementSelectionItem, targetNoteTitle, textContext, onSelect}: noteLinkMatchResultLinkMatchCandidateReplacementProps) => {
    console.table(replacementSelectionItem);
    return (
        <li className={"replacement-item"}>

            <input
                className={"checkbox"}
                type={"checkbox"}
                checked={replacementSelectionItem.is_selected}
                onChange={(e) => {
                    onSelect();
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