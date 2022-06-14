use js_sys::Array;
use wasm_bindgen::prelude::*;
use crate::Note;
use crate::rs::replacer::replacement::Replacement;
use crate::rs::util::range::Range;

#[wasm_bindgen]
pub struct NoteChangeOperation {
    path: String,
    content: String,
    replacements: Array
}

#[wasm_bindgen]
impl NoteChangeOperation {
    #[wasm_bindgen(constructor)]
    pub fn new(path: String, content: String, replacements: Array) -> Self {
        NoteChangeOperation {
            path,
            content,
            replacements
        }
    }

    #[wasm_bindgen(getter)]
    pub fn path(&self) -> String {self.path.clone()}
    #[wasm_bindgen(getter)]
    pub fn content(&self) -> String {self.content.clone()}
    #[wasm_bindgen(getter)]
    pub fn replacements(&self) -> Array { self.replacements.clone() }
    #[wasm_bindgen(setter)]
    pub fn set_replacements(&mut self, replacements: Array) { self.replacements = replacements }
}