use js_sys::Array;
use wasm_bindgen::prelude::*;

use crate::rs::matching::link_match::LinkMatch;
use crate::rs::note::note::Note;

#[wasm_bindgen]
pub struct LinkMatchingResult {
    note: Note,
    link_matches: Array // TODO: Rename -> link_match
}

#[wasm_bindgen]
impl LinkMatchingResult {
    #[wasm_bindgen(getter)]
    pub fn note(&self) -> Note { self.note.clone() }
    #[wasm_bindgen(getter)]
    pub fn link_matches(&self) -> Array { self.link_matches.clone() }
}

impl LinkMatchingResult {
    pub fn new (note: Note, text_link_matches_vec: Vec<LinkMatch>) -> Self {
        let text_link_matches = js_sys::Array::new();
        for text_link_match in text_link_matches_vec {
                text_link_matches.push(&text_link_match.into());
        };
        LinkMatchingResult {
            note,
            link_matches: text_link_matches
        }
    }
}