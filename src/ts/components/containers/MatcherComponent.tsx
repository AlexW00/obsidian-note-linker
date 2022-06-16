import * as React from "react";
import * as ReactDOM from "react-dom";
import {useContext, useEffect, useState} from "react";
import {
    LinkMatch, LinkTargetCandidate,
    Note,
    NoteChangeOperation,
    NoteMatchingResult,
    NoteScannedEvent,
    Range,
    Replacement, SelectionItem
} from "../../../../pkg";
import JsNote from "../../JsNote";
import {AppContext} from "../../context";
import * as wasm from "../../../../pkg";
import Progress from "../../Progress";
import {ProgressComponent} from "../general/ProgressComponent";
import {NoteMatchingResultsList} from "../lists/NoteMatchingResultsListComponent";


export const MatcherComponent = () => {

    const {vault, metadataCache} = useContext(AppContext);

    const [noteMatchingResults, setNoteMatchingResults] = useState<Array<NoteMatchingResult>>([]);
    const [linkMatchingProgress] = useState<Progress>(new Progress(JsNote.getNumberOfNotes(vault, metadataCache)));
    //TODO: Init state
    const [note_change_operations, set_note_change_operations] = useState<Map<String, NoteChangeOperation>>(new Map());

    const onLinkMatchingProgress = (noteScannedEvent: NoteScannedEvent) => {
        linkMatchingProgress.increment();
        console.log(linkMatchingProgress.isComplete());
    }

    const handleNoteChangeOperationSelected = (note_change_operation: NoteChangeOperation, doAdd: boolean) => {
        const new_note_change_operations: Map<String, NoteChangeOperation> = note_change_operations;

        if (doAdd) addNoteChangeOperation(new_note_change_operations, note_change_operation)
        else removeNoteChangeOperation(new_note_change_operations, note_change_operation)
    }

    const removeNoteChangeOperation = (new_note_change_operations: Map<String, NoteChangeOperation>, note_change_operation_to_remove: NoteChangeOperation) => {
        const didDelete = new_note_change_operations.delete(note_change_operation_to_remove.path)
        if (didDelete) set_note_change_operations(new_note_change_operations)
    }

    const addNoteChangeOperation = (new_note_change_operations: Map<String, NoteChangeOperation>, new_note_change_operation: NoteChangeOperation) => {
        if (!new_note_change_operations.has(new_note_change_operation.path)) {
            new_note_change_operations.set(new_note_change_operation.path, new_note_change_operation)
        } else {
            const existing_note_change_operation = new_note_change_operations.get(new_note_change_operation.path);

            new_note_change_operation.replacements.forEach((replacement: Replacement) => {
                const index = existing_note_change_operation.replacements.findIndex(((r: Replacement) => r.position.is_equal_to(replacement.position)))
                console.log(index);
                if (index != -1) existing_note_change_operation.replacements[index] = replacement;
                else existing_note_change_operation.replacements.push(replacement);
            })
            new_note_change_operations.set(new_note_change_operation.path, existing_note_change_operation)
            set_note_change_operations(new_note_change_operations)
            console.log(note_change_operations)
        }
    }

    const initNoteChangeOperations = (noteLinkMatchResults: Array<NoteMatchingResult>) => {
        const operations : Map<String, NoteChangeOperation> = new Map;
            noteLinkMatchResults.forEach((result: NoteMatchingResult) => {
            const path = result.note.path;
            const content = result.note.content;
            const replacements : Array<Replacement> = [];
            // TODO: Extra function?
            result.link_matches.forEach((match: LinkMatch) => {
                match.link_match_target_candidate.forEach((candidate: LinkTargetCandidate) => {
                    candidate.replacement_selection_items.forEach((selection: SelectionItem) => {
                        if (selection.is_selected) {
                            replacements.push(
                                new Replacement(
                                    match.position,
                                    selection.content
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
        set_note_change_operations(operations)
    }

    useEffect(() => {
        // On mount
        JsNote.getNotesFromVault(vault, metadataCache)
            .then((jsNotes: JsNote[]) => wasm.find(this, jsNotes as Note[], onLinkMatchingProgress))
            .then((noteLinkMatchResults: Array<NoteMatchingResult>) => {
                console.log("got results");
                setNoteMatchingResults(noteLinkMatchResults)
                initNoteChangeOperations(noteLinkMatchResults);
            })
        return () => {
            // On unmount
        }
    }, []);

    return (
        linkMatchingProgress.isComplete()
            ? <NoteMatchingResultsList noteMatchingResults={noteMatchingResults}
                                       onNoteChangeOperationSelected={handleNoteChangeOperationSelected}
            />
            : <ProgressComponent progress={linkMatchingProgress}/>
    );
};

