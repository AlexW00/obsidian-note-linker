## 🔗 Obsidian Note Linker

A plugin to automatically create new links between notes in Obsidian.

![ezgif com-gif-maker(4)](https://user-images.githubusercontent.com/55558407/187985324-c13860b0-42e0-41d8-9498-8df936948dfd.gif)


### 🤨 How does it work?

The plugin checks each note in the vault for references to other note names (or their aliases).
If a reference is found, it gets added to a list. This list is then displayed to the user, who can select which notes to
link.

#### Disclaimer:

The current version has only been tested by myself, and a few beta testers. No bugs are currently known. However, I advise you to backup your vault before applying any changes using this plugin, since the plugin has not been tested by enough people. 

### ⬇️ Installation

You can install this plugin by downloading it from the Obsidian Plugin store, or via [this direct link](https://obsidian.md/plugins?id=obisidian-note-linker).

### 👨‍💻 Development

The plugin is written in Rust (compiled to WebAssembly) and TypeScript. 
For more information please, check the [dev docs](docs/dev-docs.md).

### 📃 Credits

Created based on the Obsidian Rust Plugin template by [trashhalo](https://github.com/trashhalo/obsidian-rust-plugin).
