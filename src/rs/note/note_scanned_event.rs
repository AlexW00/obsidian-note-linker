use wasm_bindgen::prelude::*;

use crate::rs::note::note::Note;

#[wasm_bindgen]
pub struct NoteScannedEvent {
    note_title: js_sys::JsString,
    note_path: js_sys::JsString,
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
    #[wasm_bindgen(getter)]
    pub fn note_title(&self) -> js_sys::JsString {
        self.note_title.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn note_path(&self) -> js_sys::JsString {
        self.note_path.clone()
    }
}