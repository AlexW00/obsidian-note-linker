import * as React from "react";
import {Replacement} from "../../../../pkg";
import {ReactEventHandler, useCallback, useContext, useEffect, useState} from "react";
import {
    LinkMatchContext,
    LinkTargetCandidateContext,
    NoteMatchingResultContext,
    SelectedNoteChangeOperations, SelectionItemContext
} from "../../context";
import {generateMockupMdLink} from "../../util";

interface noteLinkMatchResultLinkMatchCandidateReplacementProps {
    onSelect: (isSelected: boolean) => void
}

export const ReplacementItemComponent = ({onSelect}: noteLinkMatchResultLinkMatchCandidateReplacementProps) => {
    const parentNote = useContext(NoteMatchingResultContext).note;
    const linkMatch = useContext(LinkMatchContext);
    const linkTargetCandidate = useContext(LinkTargetCandidateContext);
    const selectionItem = useContext(SelectionItemContext);
    const {noteChangeOperations} = useContext(SelectedNoteChangeOperations);

    const noteChangeOperation = noteChangeOperations.get(parentNote.path);

    const isSelected = useCallback(() => {
            if (noteChangeOperation === undefined || noteChangeOperation.replacements === undefined) return false;
            const isSelected = noteChangeOperation.replacements.find(
                (replacement: Replacement) => {
                    return replacement.position.start == linkMatch.position.start &&
                        replacement.position.end == linkMatch.position.end &&
                        replacement.targetNotePath == linkTargetCandidate.path &&
                        replacement.originalSubstitute == selectionItem.content;
                }
            ) != undefined;
            return isSelected
        }, [noteChangeOperations]);


    return (
        <li className={"replacement-item"}>
            <input
                className={"checkbox"}
                type={"checkbox"}
                checked={isSelected()}
                onChange={() => onSelect(!isSelected())}
            />
            <span className={"matched-text"}>
                "{selectionItem.content}"
            </span>
            <div className={"replacement-context"}>
                <span className={"arrow-icon"}>→</span>
                <span className={"context-tail"}>
                    "... {linkMatch.context.left_context_tail.text}
                </span>
                <span className={"link-preview"}>
                    {generateMockupMdLink(selectionItem.content, linkTargetCandidate.title)}
                </span>
                <span className={"context-tail"}>
                    {linkMatch.context.right_context_tail.text} ..."
                </span>
            </div>
        </li>
    );
};
