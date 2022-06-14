import * as React from "react";
import * as ReactDOM from "react-dom";
import {LinkTargetCandidate, SelectionItem, TextContext} from "../../../../pkg";
import {ReplacementItemComponent} from "../items/ReplacementItemComponent";
import {useState} from "react";
import {string} from "prop-types";


interface noteLinkMatchResultLinkMatchCandidateProps {
    linkTargetCandidate: LinkTargetCandidate
    textContext: TextContext
    isPrimary: boolean
}

export const ReplacementsSelectionComponent = ({linkTargetCandidate, textContext, isPrimary}: noteLinkMatchResultLinkMatchCandidateProps) => {

    return (
        <li>
            <span>
                🔗{linkTargetCandidate.path}
            </span>
            <ul>
                {linkTargetCandidate.replacement_selection_items.map((replacement_selection_item: SelectionItem) => {
                    return (
                        <ReplacementItemComponent
                            replacement={replacement_selection_item.content}
                            targetNoteTitle={linkTargetCandidate.title}
                            textContext={textContext}
                            // TODO: change the isPrimary stuff
                            isSelected={(replacement_selection_item.is_selected) && isPrimary}
                            key={replacement_selection_item.content + "-replacement"}
                            onChange={ (e) => {
                                console.log("changed", e);
                                replacement_selection_item.selected = true;
                            }}
                        />
                    )
                })}
            </ul>
        </li>
    );
};
