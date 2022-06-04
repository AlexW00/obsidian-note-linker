use wasm_bindgen::prelude::*;
use crate::{link_match_vec_to_array, LinkMatch, Note};
use crate::rs::text::link_match::LinkMatchArray;
use wasm_bindgen::{JsCast, JsValue};

#[wasm_bindgen]
pub struct NoteMatchResult {
    note: Note,
    link_matches: LinkMatchArray,
}

#[wasm_bindgen]
impl NoteMatchResult {
    #[wasm_bindgen(getter)]
    pub fn note(&self) -> Note {
        self.note.clone()
    }
    /*#[wasm_bindgen(getter)]
    pub fn link_matches(&self) -> LinkMatchArray {
        self.link_matches.clone()
    }*/
}

impl NoteMatchResult {
    pub fn new(note: &Note, link_matches: Vec<LinkMatch>) -> NoteMatchResult {
        NoteMatchResult {
            note: note.clone(),
            link_matches: LinkMatchArray::from(link_matches),
        }
    }

    pub fn push_link_match(&mut self, link_match: &LinkMatch) {
        let lm = link_match.clone();
        self.link_matches.push(lm);
    }

    pub fn into_array(note_match_results: Vec<NoteMatchResult>) -> js_sys::Array {
        let mut array = js_sys::Array::new();
        for note_match_result in note_match_results {
            let js_val = note_match_result.into();
            array.push(&js_val);
        }
        array
    }
}