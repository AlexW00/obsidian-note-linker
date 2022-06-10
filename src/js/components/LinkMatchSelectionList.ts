import {LinkMatch} from "../../../pkg";
import Renderable from "./Renderable";
import LinkMatchItem from "./LinkMatchItem";

export default class LinkMatchSelectionList implements Renderable{

    private readonly linkMatches: LinkMatch[];

    constructor(linkMatches: LinkMatch[]) {
        this.linkMatches = linkMatches;
    }

    $title(): HTMLElement {
        const title = document.createElement("h2");
        title.innerText = "Link Matches";
        return title;
    }

    $list(): HTMLElement {
        const list = document.createElement("ul");
        list.classList.add("matching-match-list");
        this.linkMatches.forEach(linkMatch => {
            const item = new LinkMatchItem(linkMatch);
            list.appendChild(item.$html());
        });
        return list;
    }

    $replaceButton(): HTMLElement {
        const button = document.createElement("button");
        button.innerText = "Replace";
        return button;
    }

    public $html(): HTMLElement {
        const root = document.createElement("div");
        root.appendChild(this.$title());
        root.appendChild(this.$list());
        root.appendChild(this.$replaceButton());
        return root;
    }
}