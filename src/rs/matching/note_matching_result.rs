use js_sys::Array;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::rs::matching::link_match::{link_match_vec_into_array, LinkMatch};
use crate::rs::note::note::Note;

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct NoteMatchingResult {
    note: Note,

    #[serde(rename = "linkMatches")]
    _link_matches: Vec<LinkMatch>,
}

#[wasm_bindgen]
impl NoteMatchingResult {
    #[wasm_bindgen(getter)]
    pub fn note(&self) -> Note { self.note.clone() }
    #[wasm_bindgen(getter, js_name = "linkMatches")]
    pub fn link_matches(&self) -> Array {
        link_match_vec_into_array(self._link_matches.clone())
    }
    #[wasm_bindgen(method, js_name = "toJSON")]
    pub fn to_json_string(&self) -> String {
        serde_json::to_string(self).unwrap()
    }

    #[wasm_bindgen(method, js_name = "fromJSON")]
    pub fn from_json_string(json_string: &str) -> Self {
        serde_json::from_str(json_string).unwrap()
    }
}

impl NoteMatchingResult {
    pub fn new(note: Note, _link_matches: Vec<LinkMatch>) -> Self {
        NoteMatchingResult {
            note,
            _link_matches,
        }
    }
}