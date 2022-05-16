mod rs;

use std::convert::TryFrom;
use js_sys::{Array, Object};
use wasm_bindgen::{JsCast, JsObject};
use wasm_bindgen::prelude::*;
use crate::rs::text::js_note::{JsNote, JsNoteArray, ToRsNote};
use crate::rs::text::rs_note::RsNote;


#[wasm_bindgen]
pub fn add (a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn find (notes: JsNoteArray) -> String {
    let arr = notes.unchecked_into::<Array>();
    arr.iter().filter_map(|note| {
        let note = JsNote::try_from(note);
        if let Ok(note) = note {
            Some(note.title())
        } else {
            None
        }
    }).collect::<Vec<String>>().join("\n")
}