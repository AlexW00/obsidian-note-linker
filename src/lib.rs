use std::convert::TryFrom;

use js_sys::{Array};
use wasm_bindgen::JsCast;
use wasm_bindgen::prelude::*;
use crate::rs::text::link_matcher;

use crate::rs::text::note::{log, Note, NoteArray};
use crate::rs::text::link_match::{note_match_vec_to_array, LinkMatch};

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

    let res: Vec<LinkMatch> = notes.clone().into_iter().flat_map(|note| {
        log(format!("searching note: {}", note.title_string()).as_str());
        let res = link_matcher::search_note_for_links(&note, &notes);
        log("done searching note");
        res
    })
    .collect();

    note_match_vec_to_array(res)
}