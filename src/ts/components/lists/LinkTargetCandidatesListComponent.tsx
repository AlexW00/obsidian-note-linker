import * as React from "react";
import {Dispatch, SetStateAction} from "react";
import {LinkMatch, LinkTargetCandidate, Note, NoteChangeOperation, Replacement} from "../../../../pkg";
import {LinkMatchTitleComponent} from "../titles/LinkMatchTitleComponent";
import {ReplacementsSelectionComponent} from "./ReplacementsSelectionComponent";
import {LinkTargetCandidateContext} from "../../context";

interface  LinkTargetCandidatesListComponentProps {
    _replacement: Replacement,
    noteChangeOperation: NoteChangeOperation,
    noteChangeOperations: Map<string, NoteChangeOperation>,
    setNoteChangeOperations: Dispatch<SetStateAction<Map<string, NoteChangeOperation>>>,
    linkMatch: LinkMatch,
    parentNote: Note
}

export const LinkTargetCandidatesListComponent = React.memo(({_replacement, noteChangeOperation, noteChangeOperations, setNoteChangeOperations, linkMatch, parentNote} : LinkTargetCandidatesListComponentProps) => {

    const [replacement, setReplacement] = React.useState<Replacement>(_replacement);
    const createNoteChangeOperation = () => {
        return new NoteChangeOperation(parentNote.path, parentNote.content, [replacement]);
    }

    const removeReplacement = () => {
        console.log("removeReplacement");
        noteChangeOperation.replacements = noteChangeOperation.replacements.filter((r: Replacement) => !(r.position.is_equal_to(linkMatch.position)));
        saveNoteChangeOperation(noteChangeOperation);
    }

    const addReplacement = (replacement: Replacement) => {
        console.log("add replacement");
        const _noteChangeOperation = noteChangeOperation !== undefined ? noteChangeOperation : createNoteChangeOperation();
        _noteChangeOperation.replacements = _noteChangeOperation.replacements.filter((r: Replacement) => !r.position.is_equal_to(linkMatch.position));
        _noteChangeOperation.replacements.push(replacement);
        saveNoteChangeOperation(_noteChangeOperation);
    }

    const saveNoteChangeOperation = (_noteChangeOperation: NoteChangeOperation) => {
        const _noteChangeOperations = new Map(noteChangeOperations.entries());
        if (_noteChangeOperation.replacements.length == 0) _noteChangeOperations.delete(_noteChangeOperation.path);
        else _noteChangeOperations.set(parentNote.path, _noteChangeOperation);
        setNoteChangeOperations(_noteChangeOperations);
        console.log("saved change operation");
    }

    React.useEffect(() => {
        if (replacement === undefined) removeReplacement();
        else addReplacement(replacement);
    }, [replacement]);

    return <div className={"link-target-candidates-list"}>
                <LinkMatchTitleComponent matchedText={linkMatch.matchedText} position={linkMatch.position}/>
                <ul className={"hide-list-styling"}>
                    {linkMatch.linkTargetCandidates.map((linkTargetCandidate: LinkTargetCandidate) =>
                        <LinkTargetCandidateContext.Provider value={linkTargetCandidate}
                                                             key={`${linkTargetCandidate.path}`}>
                                <ReplacementsSelectionComponent selectedReplacement={replacement} setSelectedReplacement={setReplacement}/>
                        </LinkTargetCandidateContext.Provider>
                    )}
                </ul>
            </div>
        ;
}, (prevProps: LinkTargetCandidatesListComponentProps, nextProps: LinkTargetCandidatesListComponentProps) => {
    return prevProps._replacement == nextProps._replacement
});