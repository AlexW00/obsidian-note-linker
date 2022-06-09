use crate::Note;
use crate::rs::text::text_link_match::TextLinkMatch;
use js_sys::Array;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct NoteLinkMatchResult {
    note: Note,
    text_link_matches: Array
}

#[wasm_bindgen]
impl NoteLinkMatchResult {
    #[wasm_bindgen(getter)]
    pub fn note(&self) -> Note { self.note.clone() }
    #[wasm_bindgen(getter)]
    pub fn text_link_matches(&self) -> Array { self.text_link_matches.clone() }
}

impl NoteLinkMatchResult {
    pub fn new (note: Note, text_link_matches_vec: Vec<TextLinkMatch>) -> Self {
        let text_link_matches = js_sys::Array::new();
        for text_link_match in text_link_matches_vec {
                text_link_matches.push(&text_link_match.into());
        };
        NoteLinkMatchResult {
            note,
            text_link_matches
        }
    }
}