import * as React from "react";
import * as ReactDOM from "react-dom";
import {Note, NoteMatchingResult, Replacement, SelectionItem, TextContext} from "../../../../pkg";
import {ReactEventHandler, useCallback, useContext, useEffect, useState} from "react";
import JsNote from "../../JsNote";
import * as wasm from "../../../../pkg";
import {
    LinkMatchContext,
    LinkTargetCandidateContext,
    NoteMatchingResultContext,
    SelectedNoteChangeOperations
} from "../../context";

interface noteLinkMatchResultLinkMatchCandidateReplacementProps {
    targetNoteTitle: string
    targetNotePath: string
    textContext: TextContext
    onSelect: (isSelected: boolean) => void
    replacementSelectionItem: SelectionItem
}

export const ReplacementItemComponent = ({replacementSelectionItem, targetNoteTitle, targetNotePath, textContext, onSelect}: noteLinkMatchResultLinkMatchCandidateReplacementProps) => {
    const parentNote = useContext(NoteMatchingResultContext).note;
    const linkMatch = useContext(LinkMatchContext);
    const replacementPosition = linkMatch.position;
    const replacementSubstitute = replacementSelectionItem.content;
    const noteChangeOperation = useContext(SelectedNoteChangeOperations)[0].get(parentNote.path);
    const isSelected = useCallback(() => {
            if (noteChangeOperation === undefined || noteChangeOperation.replacements === undefined) return false;
            return noteChangeOperation.replacements.find(
                (replacement: Replacement) => {
                    // remove last two characters and anything up to the | character
                    return replacement.position.start == replacementPosition.start &&
                        replacement.position.end == replacementPosition.end &&
                        replacement.targetNotePath == targetNotePath &&
                        replacement.originalSubstitute == replacementSubstitute;
                }
            ) != undefined
        }
    , [noteChangeOperation]);
    return (
        <li className={"replacement-item"}>
            <input
                className={"checkbox"}
                type={"checkbox"}
                checked={isSelected()}
                onChange={() => onSelect(!isSelected())}
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