import * as React from "react";
import {useCallback, useContext} from "react";
import {LinkMatch, LinkTargetCandidate, PreferrableItem, Replacement} from "../../../../pkg";
import {generateMockupMdLink} from "../../util";
import {
    useApp,
    useLinkFinderResult,
    useLinkMatch,
    useLinkTargetCandidate,
    useNoteFiles,
    useReplacementCandidate
} from "../../hooks";
import {ReplacementContext} from "../../context";


export const ReplacementItemComponent = () => {
    const {fileManager} = useApp();
    const parentNote = useLinkFinderResult().note;
    const linkMatch = useLinkMatch();
    const linkTargetCandidate = useLinkTargetCandidate();
    const replacementCandidate = useReplacementCandidate();
    const noteFiles = useNoteFiles();

    const {replacement, setReplacement} = useContext(ReplacementContext);

    const isSelected = useCallback(() => {
        if (replacement === undefined) return false;
        return replacement.position.is_equal_to(linkMatch.position) &&
            replacement.targetNotePath == linkTargetCandidate.path &&
            replacement.originalSubstitute == replacementCandidate.content
    }, [replacement]);


    const subtractReplacement = () => {
        setReplacement(undefined);
    }

    const addReplacement = (noteChangeOperationToAdd: Replacement) => {
        setReplacement(noteChangeOperationToAdd);
    }

    const handleSelect = (replacementCandidate: PreferrableItem, candidate: LinkTargetCandidate, doAdd: boolean, linkMatch: LinkMatch) => {
        const replacement = new Replacement(
            linkMatch.position,
            fileManager.generateMarkdownLink(
                noteFiles.get(candidate.path),
                parentNote.path,
                null,
                replacementCandidate.content == parentNote.title
                    ? null
                    : replacementCandidate.content
            ),
            replacementCandidate.content,
            candidate.path
        );


        console.log("setting state")
        if (doAdd) addReplacement(replacement)
        else subtractReplacement()
    }

    return (
        <li className={"replacement-item"} onClick={() => handleSelect(replacementCandidate, linkTargetCandidate, !isSelected(), linkMatch)}>
            <input
                className={"task-list-item-checkbox"}
                type={"checkbox"}
                checked={isSelected()}
                onChange={() => {}}
            />
            <span className={"matched-text"}>
                "{replacementCandidate.content}"
            </span>
            <div className={"replacement-context"}>
                <span className={"arrow-icon"}>→</span>
                <span className={"context-tail"}>
                    "... {linkMatch.context.leftContextTail.text}
                </span>
                <span className={"link-preview"}>
                    {generateMockupMdLink(replacementCandidate.content, linkTargetCandidate.title)}
                </span>
                <span className={"context-tail"}>
                    {linkMatch.context.rightContextTail.text} ..."
                </span>
            </div>
        </li>
    );
};
