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
} from "../../hooks";

interface ReplacementItemComponentProps {selectedReplacement: Replacement, setSelectedReplacement:  React.Dispatch<React.SetStateAction<Replacement>>, replacementCandidate: PreferrableItem}

export const ReplacementItemComponent = React.memo(({selectedReplacement, setSelectedReplacement, replacementCandidate}: ReplacementItemComponentProps) => {
    const {fileManager} = useApp();
    const parentNote = useLinkFinderResult().note;
    const linkMatch = useLinkMatch();
    const linkTargetCandidate = useLinkTargetCandidate();
    const noteFiles = useNoteFiles();


    const isSelected = useCallback(() => {
        if (selectedReplacement === undefined) return false;
        return selectedReplacement.position.is_equal_to(linkMatch.position) &&
            selectedReplacement.targetNotePath == linkTargetCandidate.path &&
            selectedReplacement.originalSubstitute == replacementCandidate.content
    }, [selectedReplacement]);


    const subtractReplacement = () => {
        setSelectedReplacement(undefined);
    }

    const addReplacement = (noteChangeOperationToAdd: Replacement) => {
        setSelectedReplacement(noteChangeOperationToAdd);
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
}, (prevProps: ReplacementItemComponentProps, nextProps: ReplacementItemComponentProps) => {
    return prevProps.selectedReplacement == nextProps.selectedReplacement
});
