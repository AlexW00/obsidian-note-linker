import {
	CachedMetadata,
	CacheItem,
	HeadingCache,
	LinkCache,
	TFile,
} from "obsidian";
import { Range } from "../../../pkg";

class IgnoreRangeBuilder {
	private readonly _ignoreRanges: IgnoreRange[] = [];
	private readonly _cache: CachedMetadata;
	private _content: string;
	private _name: string;

	constructor(content: string, cache: CachedMetadata, name: string) {
		this._content = content;
		this._cache = cache;
		this._name = name;
	}

	public build(): IgnoreRange[] {
		if (
			this._name ==
			"How to Build a Universe That Doesn’t Fall Apart Two Days Later - German Cut.md"
		) {
			console.log("🎇".length, [..."🎇"].length);
		}
		return this._ignoreRanges.sort((a, b) => a.start - b.start);
	}

	private addCacheSections(type: string): IgnoreRangeBuilder {
		(this._cache.sections ? this._cache.sections : [])
			.filter((section) => section.type === type)
			.forEach((section) => {
				const ignoreRange = new IgnoreRange(
					section.position.start.offset,
					section.position.end.offset
				);
				orderedPush(this._ignoreRanges, ignoreRange);

				this._content =
					this._content.substring(0, ignoreRange.start) +
					" ".repeat(ignoreRange.end - ignoreRange.start) +
					this._content.substring(ignoreRange.end);
			});
		return this;
	}

	private addCacheItem(cacheItem: CacheItem[]) {
		(cacheItem ? cacheItem : []).forEach((item) => {
			const ignoreRange = new IgnoreRange(
				item.position.start.offset,
				item.position.end.offset
			);
			orderedPush(this._ignoreRanges, ignoreRange);
			this._content =
				this._content.substring(0, ignoreRange.start) +
				" ".repeat(ignoreRange.end - ignoreRange.start) +
				this._content.substring(ignoreRange.end);

			if (
				this._name ==
				"How to Build a Universe That Doesn’t Fall Apart Two Days Later - German Cut.md"
			) {
				console.log(
					`found cached match at ${ignoreRange.start} to ${ignoreRange.end}`
				);
			}
		});
		return this;
	}

	// adds internal links to the ignore ranges
	// internal links are of the form [[link text]] or [[#link text]]
	public addInternalLinks(): IgnoreRangeBuilder {
		return this.addCacheItem(this._cache.links);
	}

	// also, do a regex search, because the cache doesn't seem to be complete
	private addRegexInternalLinks(): IgnoreRangeBuilder {
		const regex = /\[\[([^\]]+)\]\]/g;
		return this.addIgnoreRangesWithRegex(regex);
	}

	// adds all headings to the ignore ranges
	// headings are of the form # Heading
	public addHeadings(): IgnoreRangeBuilder {
		return this.addCacheItem(this._cache.headings);
	}

	// adds code blocks to the ignore ranges
	// code blocks are of the form ```code```
	public addCodeSections(): IgnoreRangeBuilder {
		return this.addCacheSections("code");
	}

	// utility function to add ignore ranges from a regex
	private addIgnoreRangesWithRegex(regex: RegExp): IgnoreRangeBuilder {
		this._content = this._content.replace(regex, (match, ...args) => {
			const start = args[args.length - 2];
			const end = start + match.length;
			// push after the element with the same or lower start index
			orderedPush(this._ignoreRanges, new IgnoreRange(start, end));
			if (
				this._name ==
				"How to Build a Universe That Doesn’t Fall Apart Two Days Later - German Cut.md"
			) {
				console.log(`found match ${match} at ${start} to ${end}`);
			}
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

	// adds all html like text sections to the ignore ranges
	public addHtml(): IgnoreRangeBuilder {
		const regex = /<[^>]+>([^>]+<[^>]+>)?/g;
		return this.addIgnoreRangesWithRegex(regex);
	}
}

export default class IgnoreRange extends Range {
	constructor(start: number, end: number) {
		super(start, end);
	}

	static getIgnoreRangesFromCache(
		content: string,
		cache: CachedMetadata,
		name: string
	): IgnoreRange[] {
		const ignoreRanges: IgnoreRange[] = new IgnoreRangeBuilder(
			content,
			cache,
			name
		)
			// from cache
			.addInternalLinks()
			.addHeadings()
			.addCodeSections()
			// from regex
			.addHtml()
			.addMdLinks()
			.addWebLinks()
			.build();

		return ignoreRanges;
	}
}

function orderedPush(ignoreRanges: IgnoreRange[], ignoreRange: IgnoreRange) {
	const index = ignoreRanges.findIndex(
		(_ignoreRange) => _ignoreRange.start >= ignoreRange.start
	);
	if (index === -1) {
		ignoreRanges.push(ignoreRange);
	} else {
		ignoreRanges.splice(index - 1, 0, ignoreRange);
	}
}
