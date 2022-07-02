import * as React from "react";
import {Range} from "../../../../pkg";

interface noteLinkMatchResultLinkMatchTitleProps {
    matchedText: string,
    position: Range
}

export const LinkMatchTitleComponent = ({matchedText, position}: noteLinkMatchResultLinkMatchTitleProps) => {
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