import * as React from "react";
import {Dispatch, SetStateAction} from "react";
import {LinkTargetCandidate, NoteChangeOperation, Replacement} from "../../../../pkg";
import {LinkMatchTitleComponent} from "../titles/LinkMatchTitleComponent";
import {ReplacementsSelectionComponent} from "./ReplacementsSelectionComponent";
import {LinkTargetCandidateContext} from "../../context";
import {useLinkFinderResult, useLinkMatch} from "../../hooks";

interface LinkTargetCandidatesListComponentProps {
    _selectedReplacement: Replacement,
    noteChangeOperation: NoteChangeOperation,
    noteChangeOperations: Map<string, NoteChangeOperation>,
    setNoteChangeOperations: Dispatch<SetStateAction<Map<string, NoteChangeOperation>>>,
}

export const LinkTargetCandidatesListComponent = React.memo(({
                                                                 _selectedReplacement,
                                                                 noteChangeOperation,
                                                                 noteChangeOperations,
                                                                 setNoteChangeOperations,
                                                             }: LinkTargetCandidatesListComponentProps) => {

    const linkMatch = useLinkMatch();
    const parentNote = useLinkFinderResult().note;

    const [selectedReplacement, setSelectedReplacement] = React.useState<Replacement>(_selectedReplacement);
    const createNoteChangeOperation = () => {
        return new NoteChangeOperation(parentNote.path, parentNote.content, [selectedReplacement]);
    }

    const removeReplacement = () => {
        noteChangeOperation.replacements = noteChangeOperation.replacements.filter((r: Replacement) => !(r.position.is_equal_to(linkMatch.position)));
        saveNoteChangeOperation(noteChangeOperation);
    }

    const addReplacement = (replacement: Replacement) => {
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
    }

    React.useEffect(() => {
        if (selectedReplacement === undefined) removeReplacement();
        else addReplacement(selectedReplacement);
    }, [selectedReplacement]);

    return <div className={"link-target-candidates-list"}>
        <LinkMatchTitleComponent matchedText={linkMatch.matchedText} position={linkMatch.position}/>
        <ul className={"hide-list-styling"}>
            {linkMatch.linkTargetCandidates.map((linkTargetCandidate: LinkTargetCandidate) =>
                <LinkTargetCandidateContext.Provider value={linkTargetCandidate}
                                                     key={`${linkTargetCandidate.path}`}>
                    <ReplacementsSelectionComponent selectedReplacement={selectedReplacement}
                                                    setSelectedReplacement={setSelectedReplacement}/>
                </LinkTargetCandidateContext.Provider>
            )}
        </ul>
    </div>
        ;
}, (prevProps: LinkTargetCandidatesListComponentProps, nextProps: LinkTargetCandidatesListComponentProps) => {
    return prevProps._selectedReplacement == nextProps._selectedReplacement
});