import {NoteFilesContext, SelectedNoteChangeOperationsContext} from "../../context";
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
    SelectionItem
} from "../../../../pkg";
import {useApp} from "../../hooks";

interface MatchSelectionComponentProps {
    linkFinderResults: Array<LinkFinderResult>;
    onClickReplaceButton: (noteChangeOperations: Map<string, NoteChangeOperation>, noteFiles: Map<string, TFile>) => void;
}

export const MatchSelectionComponent = ({
                                            linkFinderResults,
                                            onClickReplaceButton
                                        }: MatchSelectionComponentProps) => {

    const {vault, fileManager} = useApp();
    const [noteChangeOperations, setNoteChangeOperations] = useState<Map<string, NoteChangeOperation>>(new Map());

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
                    candidate.selectionItems.forEach((selection: SelectionItem) => {
                        if (selection.isSelected) {
                            replacements.push(
                                new Replacement(
                                    match.position,
                                    fileManager.generateMarkdownLink(
                                        noteFiles.get(candidate.path),
                                        result.note.path,
                                        null,
                                        selection.content == result.note.title
                                            ? null
                                            : selection.content
                                    ),
                                    selection.content,
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
        <SelectedNoteChangeOperationsContext.Provider value={{noteChangeOperations, setNoteChangeOperations}}>
            <LinkFinderResultsList linkFinderResults={linkFinderResults}
                                     onClickReplaceButton={() => onClickReplaceButton(noteChangeOperations, noteFiles)}
            />
            <div>
                {noteChangeOperations.size}
            </div>
        </SelectedNoteChangeOperationsContext.Provider>
    </NoteFilesContext.Provider>)
}