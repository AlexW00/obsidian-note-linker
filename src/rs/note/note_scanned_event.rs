use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

use crate::rs::note::note::Note;

/// An event that is emitted when a Note has been scanned for links by the Link Finder.
#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct NoteScannedEvent {
    note_title: String,
    note_path: String,
    index: usize,
}
#[wasm_bindgen]
impl NoteScannedEvent {
    #[wasm_bindgen(constructor)]
    pub fn new(note: &Note, index: usize) -> NoteScannedEvent {
        NoteScannedEvent {
            note_title: note.title(),
            note_path: note.path(),
            index,
        }
    }
    #[wasm_bindgen(getter, js_name="noteTitle")]
    pub fn note_title(&self) -> String { self.note_title.clone() }

    #[wasm_bindgen(getter, js_name="notePath")]
    pub fn note_path(&self) -> String { self.note_path.clone() }

    #[wasm_bindgen(getter, js_name="index")]
    pub fn index(&self) -> usize { self.index }

    #[wasm_bindgen(method, js_name = "toJSON")]
    pub fn to_json_string(&self) -> String {
        serde_json::to_string(self).unwrap()
    }

    #[wasm_bindgen(method, js_name = "fromJSON")]
    pub fn from_json_string(json_string: &str) -> Self {
        serde_json::from_str(json_string).unwrap()
    }
}