## 🔗 Obsidian Note Linker

A plugin to automatically create new links between notes in Obsidian.

!usage-gif

### 🤨 How does it work?

The plugin checks each note in the vault for references to other note names (or their aliases).
If a reference is found, it gets added to a list. This list is then displayed to the user, who can select which notes to
link.

### ⬇️ Installation

This plugin is not in the [official community plugin list](https://obsidian.md/plugins) yet, so it can't be installed via the
built-in plugin manager. However, there are other ways to install it:
<details>
    <summary>Install via Plugins Galore (super easy)</summary>
        <ol>
            <li>
                Install the <a href="https://obsidian.md/plugins?id=plugins-galore">Plugin Galore</a> Obsidian plugin, which allows loading unofficial plugins.
            </li>
            <li>
            Follow the instructions on the <a href="https://github.com/plugins-galore/obsidian-plugins-galore">Plugins Galore GitHub</a> to install Note Linker.
            </li>
        </ol>
    </details>
<details>
    <summary>Manual installation (easy)</summary>
        <ol>
            <li>
                Download the plugin (zip file) from <a href="https://github.com/AlexW00/obsidian-note-linker/releases/latest"> here</a>.
            </li>
            <li>
                <span>
                Extract the contents of the zip file into your Obsidian plugins folder. <br>
                    <ul>
                        <li>
                        The folder is located at <code>MyVault/.obsidian/plugins</code>.
                        </li>
                        <li>
                        It can also be found by opening <code>Obsidian > settings > community plugins > installed plugins > small folder icon on the right side </code>.
                        </li>
                    </ul> 
                </span>            
            </li>
            <li>
            Enable the plugin by going to <code>Obsidian > settings > community plugins > installed plugins</code> and activating the toggle under "Note Linker" (you may need to re-open Obsidian to see the toggle).
            </li>
        </ol>
</details>

### 👨‍💻 Development

The plugin is written in Rust (compiled to WebAssembly) and TypeScript.

#### Project structure

##### Rust

The Rust part of the project handles the business logic such as scanning notes via regex or applying changes to notes.
It is written to be independent of Obsidian, meaning the plugin could be ported over to other note-taking apps with minimal changes.

##### Typescript

The TypeScript part of the project is used create the UI using React. Also, it serves as an accesses point to the Obsidian plugin API to retrieve notes, metadata, etc.

#### Contributing

Contributions are welcome, but please make sure they are understandable and no bloat

#### Roadmap

#### Near future

- [ ] become an official community plugin
- [ ] await user feedback on the reliability of the plugin to move out of beta

#### Future (ideas)

- [ ] caching of scanned notes to improve performance on re scans
- [ ] scanning options (e.g. ignore notes, custom regex, etc.)
- [ ] multithreading (depends on how WASM develops over time)
- [ ] NLP based approach (e.g. "link to notes with similar content")

### 📃 Credits

Created based on the Obsidian Rust Plugin template by [trashhalo](https://github.com/trashhalo/obsidian-rust-plugin)
