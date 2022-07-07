use std::convert::TryFrom;
use std::sync::Arc;
use futures::{stream, Stream};
use futures::lock::Mutex;

use js_sys::{Array, Promise};
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
pub async fn find (context: JsValue, notes: NoteArray, callback: js_sys::Function) -> Result<JsValue, JsValue> {
    let arr = notes.unchecked_into::<Array>();
    let notes: Vec<Note> = arr.iter()
        .filter_map(|note: JsValue| Note::try_from(note).ok())
        .collect();

    let res: Array = Array::new();
    for note in &notes {
        let args = js_sys::Array::new();
        let note_scanned_event = NoteScannedEvent::new(note);
        let js: JsValue = note_scanned_event.into();
        args.push(&js);
        callback.apply(&context, &args).unwrap();

        // this function is another async one and takes about 2 seconds to complete:
        let link_matches_result_future = link_matcher::get_link_matches(note, &notes);
        let link_matches_result = link_matches_result_future.await;
        if let Ok(r) = link_matches_result {
            res.push(&r);
        }
    };
    Ok(res.into())
}

// receives callback and calls it after 5 sec
#[wasm_bindgen]
pub fn set_timeout(ctx: &JsValue, callback: &js_sys::Function) {
    let arr = js_sys::Array::new();
    log("Calling");
    callback.apply(ctx, &arr);
}