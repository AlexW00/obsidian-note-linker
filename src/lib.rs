use std::convert::TryFrom;
use futures::{stream, Stream};

use js_sys::{Array, Function, Promise};
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;

use crate::rs::matching::link_matcher;
use crate::rs::matching::note_matching_result::NoteMatchingResult;
use crate::rs::note::note::{Note};
use crate::rs::note::note_scanned_event::NoteScannedEvent;
use crate::rs::util::wasm_util::log;

mod rs;

#[wasm_bindgen]
pub fn add (a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn find (context: JsValue, notes: Array, callback: Function) -> Array {
    let notes: Vec<Note> = notes.iter()
        .filter_map(|note: JsValue| Note::try_from(note).ok())
        .collect();

    let mut res: Vec<NoteMatchingResult> = vec![];

    notes.clone().iter_mut().for_each(|note: &mut Note| {
        let callback_result = call_callback(&callback, &context, build_args(note));
        if let Ok(_callback_result) = callback_result {
            log("callback result ok");
        }

        let link_matches_result_option = link_matcher::get_link_matches(note, &notes);
        if let Some(r) = link_matches_result_option {
            log("some");
            res.push(r);
        } else {
            log("none");
        }
    });
    let array: Array = Array::new();
    for r in res {
        let js: JsValue = r.into();
        array.push(&js);
    }
    array
}

fn build_args (note: &Note) -> Array {
    let args = js_sys::Array::new();
    let note_scanned_event = NoteScannedEvent::new(note);
    let js: JsValue = note_scanned_event.into();
    args.push(&js);
    args
}

fn call_callback(callback: &Function, context: &JsValue, args: Array) -> Result<(), JsValue> {
    callback.apply(context, &args)?;
    Ok(())
}

#[wasm_bindgen]
pub fn find_silent(notes: Array) -> Array {
    let notes: Vec<Note> = notes.iter()
        .filter_map(|note: JsValue| Note::try_from(note).ok())
        .collect();

    log(format!("Array len: {}", &notes.len()).as_str());
    let mut res: Vec<NoteMatchingResult> = vec![];
    notes.clone().iter_mut().for_each(|note: &mut Note| {
        let link_matches_result_option = link_matcher::get_link_matches(note, &notes);
        if let Some(r) = link_matches_result_option {
            log("some");
            res.push(r);
        } else {
            log("none");
        }
    });
    let array: Array = Array::new();
    for r in res {
        let js: JsValue = r.into();
        array.push(&js);
    }
    array
}

// receives callback and calls it after 5 sec
#[wasm_bindgen]
pub fn set_timeout(ctx: &JsValue, callback: &js_sys::Function) {
    let arr = js_sys::Array::new();
    log("Calling");
    callback.apply(ctx, &arr);
}