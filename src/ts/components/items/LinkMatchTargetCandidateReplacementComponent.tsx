import * as React from "react";
import * as ReactDOM from "react-dom";
import {TextContext} from "../../../../pkg";

interface LinkMatchingResultLinkMatchCandidateReplacementProps {
    replacement: string
    targetNoteTitle: string
    textContext: TextContext
}

export const LinkMatchTargetCandidateReplacementComponent = ({replacement, targetNoteTitle, textContext}: LinkMatchingResultLinkMatchCandidateReplacementProps) => {

    return (
        <li>
            <input type={"checkbox"}/>
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
    return replacement == targetNoteTitle;
}

const generateMockupMdLink = (replacement: string, targetNoteTitle: string) : string => {
    return  isAlias(replacement, targetNoteTitle)
        ? `[[${targetNoteTitle}|${replacement}]]`
        : `[[${replacement}]]`;
}