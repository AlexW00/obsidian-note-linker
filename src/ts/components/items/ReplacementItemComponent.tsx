import * as React from "react";
import * as ReactDOM from "react-dom";
import {TextContext} from "../../../../pkg";
import {ReactEventHandler} from "react";

interface noteLinkMatchResultLinkMatchCandidateReplacementProps {
    replacement: string
    targetNoteTitle: string
    textContext: TextContext
    isSelected: boolean
    onSelect: ReactEventHandler<HTMLInputElement>
}

export const ReplacementItemComponent = ({replacement, targetNoteTitle, textContext, isSelected, onSelect}: noteLinkMatchResultLinkMatchCandidateReplacementProps) => {

    return (
        <li>
            <input type={"checkbox"} checked={isSelected} onChange={onSelect}/>
            <span>
                {replacement}
            </span>
            <span>
                "{textContext.left_context_tail.text}{generateMockupMdLink(replacement, targetNoteTitle)}{textContext.right_context_tail.text}"
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