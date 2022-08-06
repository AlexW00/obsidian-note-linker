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
            Follow the instructions on the <a href="https://github.com/plugins-galore/obsidian-plugins-galore#adding-a-plugin">Plugins Galore GitHub</a> to install Note Linker.
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
For more information please, check the [dev docs](docs/dev-docs.md).

### 📃 Credits

Created based on the Obsidian Rust Plugin template by [trashhalo](https://github.com/trashhalo/obsidian-rust-plugin).
