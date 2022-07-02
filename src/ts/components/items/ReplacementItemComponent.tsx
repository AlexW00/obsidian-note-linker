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
            <span className={"matched-text"}>
                "{replacementSelectionItem.content}"
            </span>
            <div className={"replacement-context"}>
                <span className={"arrow-icon"}>→</span>
                <span className={"context-tail"}>
                    "... {textContext.left_context_tail.text}
                </span>
                <span className={"link-preview"}>
                    {generateMockupMdLink(replacementSelectionItem.content, targetNoteTitle)}
                </span>
                <span className={"context-tail"}>
                    {textContext.right_context_tail.text} ..."
                </span>
            </div>
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