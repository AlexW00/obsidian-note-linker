import * as React from "react";
import {Range} from "../../../../pkg";

interface linkFinderResultLinkMatchTitleProps {
    matchedText: string,
    position: Range
}

export const LinkMatchTitleComponent = ({matchedText, position}: linkFinderResultLinkMatchTitleProps) => {
    return (
        <div className={"link-match-title"}>
            <h4>
                "{matchedText}"
            </h4>
            <span className={"light-description"}>
                ({position.start}-{position.end})
            </span>
        </div>
    )
};