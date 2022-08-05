use wasm_bindgen::prelude::*;

use crate::rs::note::note::Note;

/// An event that is emitted when a Note has been scanned for links by the Link Finder.
#[wasm_bindgen]
pub struct NoteScannedEvent {
    note_title: String,
    note_path: String,
}
#[wasm_bindgen]
impl NoteScannedEvent {
    #[wasm_bindgen(constructor)]
    pub fn new(note: &Note) -> NoteScannedEvent {
        NoteScannedEvent {
            note_title: note.title(),
            note_path: note.path(),
        }
    }
    #[wasm_bindgen(getter, js_name="noteTitle")]
    pub fn note_title(&self) -> String { self.note_title.clone() }

    #[wasm_bindgen(getter, js_name="notePath")]
    pub fn note_path(&self) -> String { self.note_path.clone() }
}