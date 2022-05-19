mod rs;

use std::convert::TryFrom;
use js_sys::{Array, JsString};
use wasm_bindgen::{JsCast};
use wasm_bindgen::prelude::*;
use crate::rs::text::note::{Note, NoteArray};
use crate::rs::text::note_match::{NoteMatch, NoteMatchArray};


#[wasm_bindgen]
pub fn add (a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn find (notes: NoteArray) -> String {
    let arr = notes.unchecked_into::<Array>();
    let notes: Vec<Note> = arr.iter()
        .filter_map(|note: JsValue| Note::try_from(note).ok())
        .collect();

    let res: Vec<NoteMatch> = notes.clone().into_iter().flat_map(|note| {
        NoteMatch::search_note_for_links(&note, &notes)
    })
    .collect();

    // reduce to concat string
    res.into_iter().fold(String::new(), |acc, note_match| {
        format!("{} {}", acc, note_match.matched_text_string())
    })
}