import { Plugin } from "obsidian";
import { App, PluginSettingTab, Setting } from "obsidian";
import rustPlugin from "../pkg/obisidian_note_linker_bg.wasm";
import * as wasm from "../pkg";
import MainModal from "./ts/MainModal";
import { init_panic_hook } from "../pkg/";
import * as Comlink from "comlink";

// @ts-ignore
import Wcw from "web-worker:./ts/webWorkers/WasmWorker.ts";
import { MatchingMode } from "./ts/components/containers/MainComponent";
import { DEFAULT_SETTINGS, NoteLinkerSettings } from "./settings";

export default class RustPlugin extends Plugin {
	public settings: NoteLinkerSettings;

	async onload() {
		await this.loadSettings();
		// init wasm
		const buffer = Uint8Array.from(atob(rustPlugin as unknown as string), (c) =>
			c.charCodeAt(0)
		);
		await wasm.default(Promise.resolve(buffer));
		init_panic_hook();

		this.addRibbonIcon("link", "Note Linker", () => this.openModal());
		this.addCommand({
			id: "open-note-linker",
			name: "Open",
			callback: this.openModal,
		});
		this.addCommand({
			id: "open-note-linker-vault",
			name: "Scan Vault",
			callback: () => this.openModal(MatchingMode.Vault),
		});
		this.addCommand({
			id: "open-note-linker-note",
			name: "Scan Note",
			callback: () => this.openModal(MatchingMode.Note),
		});

		this.addSettingTab(new NoteLinkerSettingTab(this.app, this));
	}

	openModal = async (_matchingModal?: MatchingMode) => {
		// init the secondary wasm thread (for searching)
		const wcw = new Wcw();
		const WasmComlinkWorker = Comlink.wrap<typeof Wcw>(wcw);
		let wasmWorkerInstance: Comlink.Remote<typeof WasmComlinkWorker>;

		wasmWorkerInstance = await new WasmComlinkWorker();
		await wasmWorkerInstance.init();

		const linkMatchSelectionModal = new MainModal(
			app,
			wasmWorkerInstance,
			() => {
				wcw.terminate();
			},
			this.settings,
			_matchingModal
		);
		linkMatchSelectionModal.open();
	};

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		if (this.settings.maxLinksPerNote < 1) {
			this.settings.maxLinksPerNote = DEFAULT_SETTINGS.maxLinksPerNote;
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class NoteLinkerSettingTab extends PluginSettingTab {
	plugin: RustPlugin;

	constructor(app: App, plugin: RustPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		containerEl.createEl("h2", {text: "Matching"});

		new Setting(containerEl)
			.setName("Limit matches per note")
			.setDesc(
				"Enable to surface only the first N matches for each linked note within a source note."
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.limitMatchesPerNote)
					.onChange(async (value) => {
						this.plugin.settings.limitMatchesPerNote = value;
						await this.plugin.saveSettings();
						this.display();
					});
			});

		if (this.plugin.settings.limitMatchesPerNote) {
			const maxMatchesSetting = new Setting(containerEl)
				.setName("Maximum matches per note")
				.setDesc(
					"Surface at most N suggestions for the same note when limits are enabled."
				)
				.addText((text) => {
					text.inputEl.type = "number";
					text.inputEl.min = "1";
					text
						.setPlaceholder("3")
						.setValue(this.plugin.settings.maxLinksPerNote.toString())
						.onChange(async (value) => {
							const parsed = Number.parseInt(value, 10);
							if (Number.isNaN(parsed)) {
								return;
							}
							const clamped = Math.max(1, parsed);
							this.plugin.settings.maxLinksPerNote = clamped;
							await this.plugin.saveSettings();
						});
					text.inputEl.addEventListener("blur", () => {
						const parsed = Number.parseInt(text.getValue(), 10);
						if (Number.isNaN(parsed)) {
							text.setValue(
								this.plugin.settings.maxLinksPerNote.toString()
							);
							return;
						}
						const clamped = Math.max(1, parsed);
						if (clamped !== parsed) {
							text.setValue(clamped.toString());
							this.plugin.settings.maxLinksPerNote = clamped;
							void this.plugin.saveSettings();
						}
					});
				});
			maxMatchesSetting.settingEl.addClass("note-linker-subsetting");

			const countExistingSetting = new Setting(containerEl)
				.setName("Count existing links toward limit")
				.setDesc(
					"Treat already linked occurrences as part of the N-match cap so rescans skip them."
				)
				.addToggle((toggle) => {
					toggle
						.setValue(
							this.plugin.settings.countExistingLinksTowardLimit
						)
						.onChange(async (value) => {
							this.plugin.settings.countExistingLinksTowardLimit = value;
							await this.plugin.saveSettings();
						});
				});
			countExistingSetting.settingEl.addClass("note-linker-subsetting");
		}
	}
}
