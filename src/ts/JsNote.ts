import {MetadataCache, parseFrontMatterAliases, Vault} from "obsidian";
import IgnoreRange from "./IgnoreRange";
import {Note} from "../../pkg";

export default class JsNote extends Note{


    constructor(title: string, path: string, content: string, aliases: string[] = [], ignore: IgnoreRange[] = []) {
        super(title, path, content, aliases, ignore);
    }
    
    static getNumberOfNotes(vault: Vault, cache: MetadataCache): number {
        return vault.getMarkdownFiles().length;
    }

    static async getNotesFromVault(vault: Vault, cache: MetadataCache): Promise<JsNote[]> {
        const notes = vault.getMarkdownFiles().map(async file => {
            const name = file.name.replace('.md', '');
            const path = file.path;
            const content = await vault.cachedRead(file);
            const aliases = parseFrontMatterAliases(cache.getFileCache(file).frontmatter) ?? [];
            const ignoreRanges = IgnoreRange.getIgnoreRangesFromCache(cache.getFileCache(file), {
                doIgnoreInternalLinks: true,
                doIgnoreCodeBlocks: true,
            }) ?? [];
            return new JsNote(name, path, content, aliases, ignoreRanges);
        });
        return await Promise.all(notes)
    }

}