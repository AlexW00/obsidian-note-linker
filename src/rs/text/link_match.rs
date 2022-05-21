use fancy_regex::{escape, Regex};
use js_sys::Array;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;

use crate::Note;
use crate::rs::text::note::log;
use crate::rs::text::range::Range;
use crate::rs::text::text_context::TextContext;

#[wasm_bindgen]
pub struct LinkMatch {
    note: Note,
    position: Range,
    matched_text: js_sys::JsString,
    context: TextContext,
}

#[wasm_bindgen]
impl LinkMatch {
    #[wasm_bindgen(getter)]
    pub fn title(&self) -> Note {
        self.note.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Range { self.position.clone() }
    #[wasm_bindgen(getter)]
    pub fn matched_text(&self) -> js_sys::JsString { self.matched_text.clone() }
    #[wasm_bindgen(getter)]
    pub fn context(&self) -> TextContext { self.context.clone() }
}

impl LinkMatch {
    pub fn new(note: &Note, position: Range, matched_text: js_sys::JsString) -> Self {
        LinkMatch {
            note: note.clone(),
            position: position.clone(),
            matched_text: matched_text.clone(),
            context: TextContext::new(note, position, matched_text),
        }
    }

    pub fn note_ref(&self) -> &Note { &self.note }
    pub fn position_ref(&self) -> &Range { &self.position }
    pub fn matched_text_ref(&self) -> &js_sys::JsString { &self.matched_text }
    pub fn context_ref(&self) -> &TextContext { &self.context }

    pub fn matched_text_string(&self) -> String { self.matched_text.as_string().expect("matched text is not a string") }


    /// Prints all the important info in one line
    pub fn print(&self) {
        println!(
            "Match [{}] (context: {}) at position: {}-{}, in note: {}",
            self.matched_text,
            self.context.text(),
            self.position.start(),
            self.position.end(),
            self.note.title_string()
        );
    }
}


#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<LinkMatch>")]
    pub type LinkMatchArray;
}

impl From<LinkMatchArray> for js_sys::Array {
    fn from(note_match_array: LinkMatchArray) -> Self {
        match note_match_array.dyn_into::<js_sys::Array>() {
            Ok(array) => array,
            Err(_) => js_sys::Array::new(),
        }
    }
}

pub fn note_match_vec_to_array (note_matches: Vec<LinkMatch>) -> js_sys::Array {
    let note_array = js_sys::Array::new();
    for note_match in note_matches {
        note_array.push(&note_match.into());
    }
    note_array
}

impl From<Vec<LinkMatch>> for LinkMatchArray {
    fn from(note_matches: Vec<LinkMatch>) -> Self {
        let note_array = js_sys::Array::new();
        for note_match in note_matches {
            note_array.push(&note_match.into());
        }
        match note_array.dyn_into::<LinkMatchArray>() {
            Ok(note_array) => note_array,
            Err(_) => panic!("Could not convert to LinkMatchArray"),
        }
    }
}