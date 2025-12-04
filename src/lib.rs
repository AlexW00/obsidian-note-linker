use std::convert::TryFrom;

use js_sys::{Array, Function};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::*;

use crate::rs::matching::link_finder;
use crate::rs::matching::link_finder_result::LinkFinderResult;
use crate::rs::note::note::Note;
use crate::rs::note::note_scanned_event::NoteScannedEvent;

mod rs;

#[wasm_bindgen]
pub fn find_in_vault(context: JsValue, notes: Array, callback: Function, 
                     max_links_per_note: usize, count_existing_links: bool,
) -> Array {
    let notes: Vec<Note> = notes.iter()
        .filter_map(|note: JsValue| Note::try_from(note).ok())
        .collect();

    let mut res: Vec<LinkFinderResult> = vec![];

    notes.clone().iter_mut().enumerate().for_each(|(index, note)| {
        let _ = call_callback(&callback, &context, build_args(note, index));

        let link_finder_result_option =
            link_finder::find_links(note, &notes, max_links_per_note, count_existing_links);
        if let Some(r) = link_finder_result_option {
            res.push(r);
        }
    });

    let array: Array = Array::new();
    for r in res {
        let js: JsValue = r.into();
        array.push(&js);
    }
    array
}


#[wasm_bindgen]
pub fn find_in_note(context: JsValue, active_note: Note, notes: Array, callback: Function,
                    max_links_per_note: usize, count_existing_links: bool,
) -> Array {
    let notes: Vec<Note> = notes.iter()
        .filter_map(|note: JsValue| Note::try_from(note).ok())
        .collect();
    let mut note = active_note.clone();

    let mut res: Vec<LinkFinderResult> = vec![];

    let _ = call_callback(&callback, &context, build_args(&note, 0));

    let link_finder_result_option =
        link_finder::find_links(&mut note, &notes, max_links_per_note, count_existing_links);
    if let Some(r) = link_finder_result_option {
        res.push(r);
    }

    let array: Array = Array::new();
    for r in res {
        let js: JsValue = r.into();
        array.push(&js);
    }
    array
}

fn build_args(note: &Note, index: usize) -> Array {
    let args = js_sys::Array::new();
    let note_scanned_event = NoteScannedEvent::new(note, index).to_json_string();
    let js: JsValue = note_scanned_event.into();
    args.push(&js);
    args
}

fn call_callback(callback: &Function, context: &JsValue, args: Array) -> Result<(), JsValue> {
    callback.apply(context, &args)?;
    Ok(())
}