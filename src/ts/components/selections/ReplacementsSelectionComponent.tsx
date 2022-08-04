import * as React from "react";
import {SelectionItem} from "../../../../pkg";
import {ReplacementItemComponent} from "../items/ReplacementItemComponent";
import {SelectionItemContext} from "../../context";
import {useLinkTargetCandidate} from "../../hooks";


export const ReplacementsSelectionComponent = () => {

    const linkTargetCandidate = useLinkTargetCandidate();
    return (
        <li className={"replacements-selection"}>
            <span className={"title"}>🔗{linkTargetCandidate.path}</span>
            <ul className={"hide-list-styling"}>
                {linkTargetCandidate.selectionItems.map((replacement_selection_item: SelectionItem, index: number) =>
                    <SelectionItemContext.Provider value={replacement_selection_item}
                                                   key={`${replacement_selection_item.content}-${index}`}>
                        <ReplacementItemComponent/>
                    </SelectionItemContext.Provider>
                )}
            </ul>
        </li>
    );
};
