mod rs;

use std::convert::TryFrom;
use js_sys::{Array};
use wasm_bindgen::{JsCast};
use wasm_bindgen::prelude::*;
use crate::rs::text::note::{Note, NoteArray};
use crate::rs::text::rs_note::RsNote;


#[wasm_bindgen]
pub fn add (a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn find (notes: NoteArray) -> String {
    let arr = notes.unchecked_into::<Array>();
    let notes: Vec<RsNote> = arr.iter().filter_map(|note: JsValue| {
        let note = Note::try_from(note);
        if let Ok(note) = note {
            Some(RsNote::from(note))
        } else {
            None
        }
    }).collect();
    notes.get(0).unwrap().title().to_string()
}