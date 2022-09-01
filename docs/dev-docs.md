## Dev Docs

### 📁 Project structure

#### Rust

The Rust part of the project handles the business logic such as scanning notes via regex or applying changes to notes.
It is written to be independent of Obsidian, meaning the plugin could be ported over to other note-taking apps with minimal changes.

#### Typescript

The TypeScript part of the project is used create the UI using React. Also, it serves as an accesses point to the Obsidian plugin API to retrieve notes, metadata, etc.

### 🤝 Contributing

Contributions are welcome, but please make sure they are understandable and no bloat

### 🗺️ Roadmap

### Near future

- [x] become an official community plugin
- [ ] await user feedback on the reliability of the plugin to move out of beta

### Future (ideas)

- [ ] caching of scanned notes to improve performance on re scans
- [ ] scanning options (e.g. ignore notes, custom regex, etc.)
- [ ] multithreading (depends on how WASM develops over time)
- [ ] NLP based approach (e.g. "link to notes with similar content")
