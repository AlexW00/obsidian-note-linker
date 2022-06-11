import * as React from "react";
import * as ReactDOM from "react-dom";
import {LinkMatch, LinkMatchingResult, LinkMatchTargetCandidate, TextContext} from "../../../../pkg";
import {LinkMatchingResultTitleComponent} from "../titles/LinkMatchingResultTitleComponent";
import {LinkMatchTargetCandidateSelectionComponent} from "../selection/LinkMatchTargetCandidateSelectionComponent";
import {LinkMatchComponent} from "./LinkMatchComponent";

interface LinkMatchingResultComponentProps {
    linkMatchingResult: LinkMatchingResult,
}

export const LinkMatchingResultComponent = ({linkMatchingResult}: LinkMatchingResultComponentProps) => {

    return (
        <div>
            <LinkMatchingResultTitleComponent noteTitle={linkMatchingResult.note.title} notePath={linkMatchingResult.note.path}/>
            <ul>
                {linkMatchingResult.link_matches.map((link_match: LinkMatch) => {
                    return <LinkMatchComponent linkMatch={link_match} key={link_match.matched_text}/>
                })}
            </ul>
        </div>
    );
};