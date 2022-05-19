use js_sys::JsString;
use crate::Note;
use crate::rs::text::range::Range;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;
use crate::rs::text::context_tail::ContextTail;

#[wasm_bindgen]
pub struct TextContext {
    left_context_tail: ContextTail,
    right_context_tail: ContextTail,
    match_text: js_sys::JsString,
}

impl TextContext {

    pub fn new(note: &Note, match_position: Range, match_text: js_sys::JsString) -> TextContext {
        TextContext {
            left_context_tail: ContextTail::new(note, &match_position, true),
            right_context_tail: ContextTail::new(note, &match_position, false),
            match_text,
        }
    }

    pub fn text(&self) -> String {
        format!(
            "...{}**{}**{}...",
            &self.left_context_tail.text_string(), &self.match_text, &self.right_context_tail.text_string()
        )
    }
}
