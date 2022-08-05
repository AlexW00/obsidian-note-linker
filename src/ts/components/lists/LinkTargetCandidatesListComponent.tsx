import * as React from "react";
import {LinkTargetCandidate, NoteChangeOperation, Replacement} from "../../../../pkg";
import {LinkMatchTitleComponent} from "../titles/LinkMatchTitleComponent";
import {ReplacementsSelectionComponent} from "./ReplacementsSelectionComponent";
import {LinkTargetCandidateContext, ReplacementContext} from "../../context";
import {useLinkFinderResult, useLinkMatch, useSelectedNoteChangeOperations} from "../../hooks";


export const LinkTargetCandidatesListComponent = () => {

    const linkMatch = useLinkMatch();
    const position = linkMatch.position;

    const parentNote = useLinkFinderResult().note;
    const {noteChangeOperations, setNoteChangeOperations} = useSelectedNoteChangeOperations();
    const noteChangeOperation = noteChangeOperations.get(parentNote.path);

    const _replacement: Replacement = noteChangeOperation ? noteChangeOperation.replacements.find((r: Replacement) => r.position.is_equal_to(position)) : undefined;
    const [replacement, setReplacement] = React.useState<Replacement>(_replacement);

    const createNoteChangeOperation = () => {
        return new NoteChangeOperation(parentNote.path, parentNote.content, [replacement]);
    }

    const removeReplacement = () => {
        noteChangeOperation.replacements = noteChangeOperation.replacements.filter((r: Replacement) => !(r.position.is_equal_to(position)));
        saveNoteChangeOperation(noteChangeOperation);
    }

    const addReplacement = (replacement: Replacement) => {
        const _noteChangeOperation = noteChangeOperation !== undefined ? noteChangeOperation : createNoteChangeOperation();
        _noteChangeOperation.replacements = _noteChangeOperation.replacements.filter((r: Replacement) => !r.position.is_equal_to(position));
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
        if (replacement === undefined) removeReplacement();
        else addReplacement(replacement);
    }, [replacement]);

    return (
        <div className={"link-target-candidates-list"}>
            <LinkMatchTitleComponent matchedText={linkMatch.matchedText} position={linkMatch.position}/>
            <ul className={"hide-list-styling"}>
                {linkMatch.linkTargetCandidates.map((linkTargetCandidate: LinkTargetCandidate) =>
                    <LinkTargetCandidateContext.Provider value={linkTargetCandidate}
                                                         key={`${linkTargetCandidate.path}`}>
                        <ReplacementContext.Provider value={{replacement, setReplacement}}>
                            <ReplacementsSelectionComponent/>
                        </ReplacementContext.Provider>
                    </LinkTargetCandidateContext.Provider>
                )}
            </ul>
        </div>
    );
};