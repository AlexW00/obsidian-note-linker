use std::convert::TryFrom;

use js_sys::{Array};
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;
use crate::rs::text::link_matcher;

use crate::rs::text::note::{log, Note, NoteArray};
use crate::rs::text::link_match::{link_match_vec_to_array, LinkMatch};
use crate::rs::text::note_scanned_event::NoteScannedEvent;
use crate::rs::text::note_match_result::NoteMatchResult;

mod rs;

#[wasm_bindgen]
pub fn add (a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn find (context: &JsValue, notes: NoteArray, callback: &js_sys::Function) -> js_sys::Array {
    let arr = notes.unchecked_into::<Array>();
    let notes: Vec<Note> = arr.iter()
        .filter_map(|note: JsValue| Note::try_from(note).ok())
        .collect();

    let res: Vec<NoteMatchResult> = notes.clone().into_iter().map(|note| {
        let args = js_sys::Array::new();
        let noteScannedEvent = NoteScannedEvent::new(&note);
        let js: JsValue = noteScannedEvent.into();
        args.push(&js);
        callback.apply(context, &args).unwrap();
        link_matcher::search_note_for_links(&note, &notes)
    })
    .collect();
    NoteMatchResult::into_array(res)
}

// receives callback and calls it after 5 sec
#[wasm_bindgen]
pub fn set_timeout(ctx: &JsValue, callback: &js_sys::Function) {
    let arr = js_sys::Array::new();
    log("Calling");
    callback.apply(ctx, &arr);
}