import * as React from "react";
import * as ReactDOM from "react-dom";
import {TextContext} from "../../../../pkg";
import {ReactEventHandler} from "react";

interface noteLinkMatchResultLinkMatchCandidateReplacementProps {
    replacement: string
    targetNoteTitle: string
    textContext: TextContext
    isSelected: boolean
    onChange: ReactEventHandler<HTMLInputElement>
}

export const ReplacementItemComponent = ({replacement, targetNoteTitle, textContext, isSelected, onChange}: noteLinkMatchResultLinkMatchCandidateReplacementProps) => {

    return (
        <li className={"replacement-item"}>
            <input 
                className={"checkbox"}
                type={"checkbox"} 
                checked={isSelected} 
                onChange={onChange}
            />
            <span className={"replacement-text"}>
                {replacement}
            </span>
            <span className={"replacement-context"}>
                "→ {textContext.left_context_tail.text}{generateMockupMdLink(replacement, targetNoteTitle)}{textContext.right_context_tail.text}"
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