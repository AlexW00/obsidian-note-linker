import {MetadataCache, parseFrontMatterAliases, Vault} from "obsidian";
import IgnoreRange from "./IgnoreRange";

export default class Note {
    title = '';
    path = '';
    content = '';
    aliases: string[] = [];
    ignore: IgnoreRange[] = [];

    constructor(title: string, path: string, content: string, aliases: string[] = [], ignore: IgnoreRange[] = []) {
        this.title = title;
        this.path = path;
        this.content = content;
        this.aliases = aliases;
        this.ignore = ignore;
    }

    static async getNotesFromVault(vault: Vault, cache: MetadataCache): Promise<Note[]> {
        const notes = vault.getMarkdownFiles().map(async file => {
            const name = file.name.replace('.md', '');
            const path = file.path;
            const content = await vault.cachedRead(file);
            const aliases = parseFrontMatterAliases(cache.getFileCache(file).frontmatter);
            const ignoreRanges = IgnoreRange.getIgnoreRangesFromCache(cache.getFileCache(file), {
                doIgnoreInternalLinks: true,
                doIgnoreCodeBlocks: true,
            });
            return new Note(name, path, content, aliases, ignoreRanges);
        });
        return await Promise.all(notes)
    }

}