use std::convert::TryFrom;

use js_sys::Array;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;

use crate::rs::matching::link_matcher;
use crate::rs::matching::note_matching_result::NoteMatchingResult;
use crate::rs::note::note::{Note, NoteArray};
use crate::rs::note::note_scanned_event::NoteScannedEvent;
use crate::rs::util::wasm_util::log;

mod rs;

#[wasm_bindgen]
pub fn add (a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn find (context: &JsValue, notes: NoteArray, callback: &js_sys::Function) -> Array {
    let arr = notes.unchecked_into::<Array>();
    let notes: Vec<Note> = arr.iter()
        .filter_map(|note: JsValue| Note::try_from(note).ok())
        .collect();

    let res: Vec<NoteMatchingResult> = notes.clone().into_iter().flat_map(|note| {
        let args = js_sys::Array::new();
        let note_scanned_event = NoteScannedEvent::new(&note);
        let js: JsValue = note_scanned_event.into();
        args.push(&js);
        callback.apply(context, &args).unwrap();
        link_matcher::get_link_matches(&note, &notes)
    })
    .collect();

    let arr2 = Array::new();
    for note_link_match_result in res {
        arr2.push(&note_link_match_result.into());
    }
    arr2
}

// receives callback and calls it after 5 sec
#[wasm_bindgen]
pub fn set_timeout(ctx: &JsValue, callback: &js_sys::Function) {
    let arr = js_sys::Array::new();
    log("Calling");
    callback.apply(ctx, &arr);
}