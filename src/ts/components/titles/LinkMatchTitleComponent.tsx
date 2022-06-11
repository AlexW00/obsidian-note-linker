import * as React from "react";
import {Range} from "../../../../pkg";

interface LinkMatchingResultLinkMatchTitleProps {
    matchedText: string,
    position: Range
}

export const LinkMatchTitleComponent = ({matchedText, position}: LinkMatchingResultLinkMatchTitleProps) => {
    return (
        <div>
            <span>
                "{matchedText}"
            </span>
            <span>
                ({position.start}-{position.end})
            </span>
        </div>
    )
};