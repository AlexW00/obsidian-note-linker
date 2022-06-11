import * as React from "react";
import {Range} from "../../../../pkg";

interface noteLinkMatchResultLinkMatchTitleProps {
    matchedText: string,
    position: Range
}

export const LinkMatchTitleComponent = ({matchedText, position}: noteLinkMatchResultLinkMatchTitleProps) => {
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