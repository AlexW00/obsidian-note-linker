use js_sys::Array;
use wasm_bindgen::prelude::*;
use crate::Note;
use crate::rs::replacer::replacement::Replacement;
use crate::rs::util::range::Range;

#[wasm_bindgen]
pub struct NoteChangeOperationResult {
    path: String,
    content: String,
}

#[wasm_bindgen]
impl NoteChangeOperationResult {
    #[wasm_bindgen(constructor)]
    pub fn new(path: String, content: String) -> Self {
        NoteChangeOperationResult {
            path,
            content,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn path(&self) -> String {self.path.clone()}
    #[wasm_bindgen(getter)]
    pub fn content(&self) -> String {self.content.clone()}
}