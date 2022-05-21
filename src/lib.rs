use std::convert::TryFrom;

use js_sys::{Array};
use wasm_bindgen::JsCast;
use wasm_bindgen::prelude::*;

use crate::rs::text::note::{Note, NoteArray};
use crate::rs::text::note_match::{note_match_vec_to_array, NoteMatch};

mod rs;

#[wasm_bindgen]
pub fn add (a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn find (notes: NoteArray) -> js_sys::Array {
    let arr = notes.unchecked_into::<Array>();
    let notes: Vec<Note> = arr.iter()
        .filter_map(|note: JsValue| Note::try_from(note).ok())
        .collect();

    let res: Vec<NoteMatch> = notes.clone().into_iter().flat_map(|note| {
        NoteMatch::search_note_for_links(&note, &notes)
    })
    .collect();

    note_match_vec_to_array(res)
}