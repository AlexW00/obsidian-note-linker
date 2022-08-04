import {AppContext, NoteFilesContext, SelectedNoteChangeOperations} from "../../context";
import {NoteMatchingResultsList} from "../lists/NoteMatchingResultsListComponent";
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {TFile} from "obsidian";
import {
    LinkMatch,
    LinkTargetCandidate,
    NoteChangeOperation,
    NoteMatchingResult,
    Replacement,
    SelectionItem
} from "../../../../pkg";

interface MatchSelectionComponentProps {
    noteMatchingResults: Array<NoteMatchingResult>;
    onClickReplaceButton: (noteChangeOperations: Map<string, NoteChangeOperation>, noteFiles: Map<string, TFile>) => void;
}

export const MatchSelectionComponent = ({
                                            noteMatchingResults,
                                            onClickReplaceButton
                                        }: MatchSelectionComponentProps) => {

    const {vault, fileManager} = useContext(AppContext);
    const [noteChangeOperations, setNoteChangeOperations] = useState<Map<string, NoteChangeOperation>>(new Map());

    const [noteFiles] = useState<Map<string, TFile>>(() => {
        const noteFiles = new Map<string, TFile>();
        vault.getFiles().forEach((file: TFile) => noteFiles.set(file.path, file))
        return noteFiles
    });

    const initNoteChangeOperations = (noteLinkMatchResults: Array<NoteMatchingResult>) => {
        const operations: Map<string, NoteChangeOperation> = new Map;
        noteLinkMatchResults.forEach((result: NoteMatchingResult) => {
            const path = result.note.path;
            const content = result.note.content;
            const replacements: Array<Replacement> = [];
            result.linkMatches.forEach((match: LinkMatch) => {
                match.linkMatchTargetCandidates.forEach((candidate: LinkTargetCandidate) => {
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

    useEffect(() => initNoteChangeOperations(noteMatchingResults), []);

    return (<NoteFilesContext.Provider value={noteFiles}>
        <SelectedNoteChangeOperations.Provider value={{noteChangeOperations, setNoteChangeOperations}}>
            <NoteMatchingResultsList noteMatchingResults={noteMatchingResults}
                                     onClickReplaceButton={() => onClickReplaceButton(noteChangeOperations, noteFiles)}
            />
            <div>
                {noteChangeOperations.size}
            </div>
        </SelectedNoteChangeOperations.Provider>
    </NoteFilesContext.Provider>)
}