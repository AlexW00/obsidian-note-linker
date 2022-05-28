import Renderable from "./Renderable";
import {LinkMatch} from "../../../pkg";

export default class LinkMatchItem implements Renderable {

    private linkMatch: LinkMatch;

    constructor(linkMatch: LinkMatch) {
        this.linkMatch = linkMatch;
    }

    $title(): HTMLElement {
        const title = document.createElement("span");
        title.classList.add("link-match-item-title");
        title.innerText = `Match "${this.linkMatch.matched_text}" in ${this.linkMatch.note.title}`;
        return title;
    }

    $subTitle(): HTMLElement {
        const subTitle = document.createElement("span");
        subTitle.classList.add("link-match-item-sub-title");
        subTitle.innerText = `${this.linkMatch.note.path}`;
        return subTitle;
    }

    $replacement(): HTMLElement {
        const replacement = document.createElement("div");
        replacement.classList.add("link-match-item-replacement");

        const title = document.createElement("span");
        title.classList.add("link-match-item-replacement-title");
        title.innerText = `🔗 ${this.linkMatch.link_target_path}`;
        replacement.appendChild(title);

        const replacementOptions = this.$replacementOptions();
        replacement.appendChild(replacementOptions);

        return replacement;
    }

    $replacementOptions(): HTMLElement {
        const title = this.linkMatch.link_target_title;
        const aliases = this.linkMatch.link_target_aliases;
        const replacementOptions = document.createElement("ul");
        replacementOptions.classList.add("link-match-item-replacement-options");

        [...aliases, title].forEach((r, i) => {
            const isAlias = r !== title;
            // add a list item with a checkbox on the right side
            const listItem = document.createElement("li");
            listItem.classList.add("link-match-item-replacement-option");


            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = r;
            checkbox.classList.add("link-match-item-replacement-checkbox");
            listItem.appendChild(checkbox);

            const replacementText = document.createElement("span");
            replacementText.classList.add("link-match-item-replacement-option-replacement-text");
            replacementText.innerText = r;
            listItem.appendChild(replacementText);

            const replacementDescription = document.createElement("span");
            replacementDescription.classList.add("link-match-item-replacement-option-description");
            replacementDescription.innerText = `→ "${this.linkMatch.context.left_context_tail.text}${this._getWikiLink(title, isAlias ? r : null)}${this.linkMatch.context.right_context_tail.text}"`;
            listItem.appendChild(replacementDescription);

            replacementOptions.appendChild(listItem);
        });

        return replacementOptions;
    }

    _getWikiLink(linkTargetTitle: string, alias: string | null): string {
        return  alias ? `[[${linkTargetTitle}|${alias}]]` : `[[${linkTargetTitle}]]`;
    }

    $html(): HTMLElement {
        const root = document.createElement("li");
        root.classList.add("link-match-item");
        root.append(this.$title());
        root.append(this.$subTitle());
        root.append(this.$replacement());
        return root;
    }

}