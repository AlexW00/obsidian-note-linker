import * as React from "react";
import { LinkFinderResult, Note, NoteChangeOperation } from "../../../../pkg";
import { LinkFinderResultContext } from "../../context";
import { LinkMatchesListComponent } from "./LinkMatchesListComponent";

interface LinkFinderResultsListProps {
	linkFinderResults: Array<LinkFinderResult>;
	onClickReplaceButton: () => void;
	noteChangeOperations: Map<string, NoteChangeOperation>;
	setNoteChangeOperations: React.Dispatch<
		React.SetStateAction<Map<string, NoteChangeOperation>>
	>;
}

export const LinkFinderResultsList = ({
	linkFinderResults,
	onClickReplaceButton,
	noteChangeOperations,
	setNoteChangeOperations,
}: LinkFinderResultsListProps) => {
	const [currentPage, setCurrentPage] = React.useState(0);
	const itemsPerPage = 30;

	const totalPages = Math.ceil(linkFinderResults.length / itemsPerPage);

	const currentItems = linkFinderResults.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage
	);

	const findNoteChangeOperation = (
		note: Note
	): NoteChangeOperation | undefined => {
		return noteChangeOperations.get(note.path);
	};

	const findReplacements = (note: Note) => {
		return findNoteChangeOperation(note)?.replacements ?? [];
	};

	const totalReplacements = React.useCallback(() => {
		let total = 0;
		noteChangeOperations?.forEach(
			(noteChangeOperation: NoteChangeOperation) => {
				total += noteChangeOperation?.replacements?.length;
			}
		);
		return total;
	}, [noteChangeOperations]);

	const handlePrevPage = () => {
		setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
	};

	const handleNextPage = () => {
		setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
	};

	if (linkFinderResults.length !== 0)
		return (
			<div className="note-matching-result-list">
				<h1>Note Link Matches</h1>
				<ul className={"hide-list-styling"}>
					{currentItems.map((linkFinderResult: LinkFinderResult) => {
						const selectedReplacements = findReplacements(
							linkFinderResult.note
						);
						return (
							<LinkFinderResultContext.Provider
								value={linkFinderResult}
								key={`${linkFinderResult.note.path}`}
							>
								<LinkMatchesListComponent
									selectedReplacements={selectedReplacements}
									noteChangeOperations={noteChangeOperations}
									setNoteChangeOperations={setNoteChangeOperations}
								/>
							</LinkFinderResultContext.Provider>
						);
					})}
				</ul>
				<div className="pagination-controls">
					<button onClick={handlePrevPage} disabled={currentPage === 0}>
						Previous
					</button>
					<span>
						Page {currentPage + 1} of {totalPages}
					</span>
					<button
						onClick={handleNextPage}
						disabled={currentPage === totalPages - 1}
					>
						Next
					</button>
				</div>
				<button onClick={onClickReplaceButton}>
					🔗 Link {totalReplacements()} notes
				</button>
			</div>
		);
	else
		return (
			<div className={"info-toast"}>👀 No notes to link could be found.</div>
		);
};
