import { CachedMetadata, TFile } from "obsidian";
import { Range } from "../../../pkg";

class IgnoreRangeBuilder {
	private readonly _ignoreRanges: IgnoreRange[] = [];
	private readonly _cache: CachedMetadata;
	private _content: string;

	constructor(content: string, cache: CachedMetadata) {
		this._content = content;
		this._cache = cache;
	}

	public build(): IgnoreRange[] {
		return this._ignoreRanges;
	}

	private addCacheSections(type: string): IgnoreRangeBuilder {
		(this._cache.sections ? this._cache.sections : [])
			.filter((section) => section.type === type)
			.forEach((section) => {
				const ignoreRange = new IgnoreRange(
					section.position.start.offset,
					section.position.end.offset
				);
				this._ignoreRanges.push(ignoreRange);
				this._content =
					this._content.substring(0, ignoreRange.start) +
					" ".repeat(ignoreRange.end - ignoreRange.start) +
					this._content.substring(ignoreRange.end);
			});
		return this;
	}

	// adds internal links to the ignore ranges
	// internal links are of the form [[link text]] or [[#link text]]
	public addInternalLinks(): IgnoreRangeBuilder {
		(this._cache.links ? this._cache.links : []).forEach((link) => {
			const ignoreRange = new IgnoreRange(
				link.position.start.offset,
				link.position.end.offset
			);
			this._ignoreRanges.push(ignoreRange);
			this._content =
				this._content.substring(0, ignoreRange.start) +
				" ".repeat(ignoreRange.end - ignoreRange.start) +
				this._content.substring(ignoreRange.end);
		});
		return this;
	}

	// adds code blocks to the ignore ranges
	// code blocks are of the form ```code```
	public addCodeSections(): IgnoreRangeBuilder {
		return this.addCacheSections("code");
	}

	// adds html sections to the ignore ranges
	// html sections are of the form <tag>...</tag>
	public addHtmlSections(): IgnoreRangeBuilder {
		return this.addCacheSections("html");
	}

	// utility function to add ignore ranges from a regex
	private addIgnoreRangesWithRegex(regex: RegExp): IgnoreRangeBuilder {
		this._content = this._content.replace(regex, (match, ...args) => {
			const start = args[args.length - 2];
			const end = start + match.length;
			this._ignoreRanges.push(new IgnoreRange(start, end));
			return " ".repeat(match.length);
		});
		return this;
	}

	// adds all web links to the ignore ranges
	public addWebLinks(): IgnoreRangeBuilder {
		// web links are of the form https://www.example.com or http://www.example.com or www.example.com
		const regex = /https?:\/\/www\..+|www\..+/g;
		return this.addIgnoreRangesWithRegex(regex);
	}

	// adds all md links to the ignore ranges
	public addMdLinks(): IgnoreRangeBuilder {
		// md links are of the form [link text](link)
		const regex = /\[([^\[]+)\](\(.*\))/g;
		return this.addIgnoreRangesWithRegex(regex);
	}
}

export default class IgnoreRange extends Range {
	constructor(start: number, end: number) {
		super(start, end);
	}

	static getIgnoreRangesFromCache(
		content: string,
		cache: CachedMetadata
	): IgnoreRange[] {
		const ignoreRanges: IgnoreRange[] = new IgnoreRangeBuilder(content, cache)
			.addInternalLinks()
			.addCodeSections()
			.addHtmlSections()
			.addMdLinks()
			.addWebLinks()
			.build();

		return ignoreRanges;
	}
}
