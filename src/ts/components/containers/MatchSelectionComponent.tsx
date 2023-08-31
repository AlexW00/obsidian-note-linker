import {NoteFilesContext} from "../../context";
import {LinkFinderResultsList} from "../lists/LinkFinderResultsListComponent";
import * as React from "react";
import {useEffect, useState} from "react";
import {TFile} from "obsidian";
import {
    LinkMatch,
    LinkTargetCandidate,
    NoteChangeOperation,
    LinkFinderResult,
    Replacement,
    PreferrableItem
} from "../../../../pkg";
import {useApp} from "../../hooks";
import {LoadingComponent} from "../other/LoadingComponent";

interface MatchSelectionComponentProps {
    linkFinderResults: Array<LinkFinderResult>;
    onClickReplaceButton: (noteChangeOperations: Map<string, NoteChangeOperation>, noteFiles: Map<string, TFile>) => void;
}

export const MatchSelectionComponent = ({
                                            linkFinderResults,
                                            onClickReplaceButton
                                        }: MatchSelectionComponentProps) => {

    const {vault, fileManager} = useApp();
    const [noteChangeOperations, setNoteChangeOperations] = useState<Map<string, NoteChangeOperation>>(undefined);

    const [noteFiles] = useState<Map<string, TFile>>(() => {
        const noteFiles = new Map<string, TFile>();
        vault.getFiles().forEach((file: TFile) => noteFiles.set(file.path, file))
        return noteFiles
    });

    const initNoteChangeOperations = (linkFinderResults: Array<LinkFinderResult>) => {
        const operations: Map<string, NoteChangeOperation> = new Map;
        linkFinderResults.forEach((result: LinkFinderResult) => {
            const path = result.note.path;
            const content = result.note.content;
            const replacements: Array<Replacement> = [];
            result.linkMatches.forEach((match: LinkMatch) => {
                match.linkTargetCandidates.forEach((candidate: LinkTargetCandidate) => {
                    candidate.replacementCandidates.forEach((replacementCandidate: PreferrableItem) => {
                        if (replacementCandidate.isPreferred) {
                            replacements.push(
                                new Replacement(
                                    match.position,
                                    fileManager.generateMarkdownLink(
                                        noteFiles.get(candidate.path),
                                        result.note.path,
                                        null,
                                        replacementCandidate.content == result.note.title
                                            ? null
                                            : replacementCandidate.content
                                    ),
                                    replacementCandidate.content,
                                    candidate.path
                                )
                            )
                            return;
                        }
                    })
                })
            })
            if (replacements.length > 0) operations.set(path, new NoteChangeOperation(
                path,
                content,
                replacements
            ))
        })
        setNoteChangeOperations(operations)
    }

    useEffect(() => initNoteChangeOperations(linkFinderResults), [linkFinderResults]);

    return (<NoteFilesContext.Provider value={noteFiles}>
            {noteChangeOperations !== undefined ? <LinkFinderResultsList linkFinderResults={linkFinderResults} noteChangeOperations={noteChangeOperations} setNoteChangeOperations={setNoteChangeOperations}
                                    onClickReplaceButton={() => onClickReplaceButton(noteChangeOperations, noteFiles)}
            /> : <LoadingComponent loadingText={"🏗️ Building results list..."}/>}
    </NoteFilesContext.Provider>)
}