use js_sys::JsString;
use crate::{log, Note};
use crate::rs::text::range::Range;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen::prelude::*;
use crate::rs::text::context_tail::ContextTail;

#[wasm_bindgen]
#[derive(Clone)]
pub struct TextContext {
    left_context_tail: ContextTail,
    right_context_tail: ContextTail,
    match_text: String,
}

#[wasm_bindgen]
impl TextContext {
    #[wasm_bindgen(getter)]
    pub fn left_context_tail(&self) -> ContextTail {
        self.left_context_tail.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn right_context_tail(&self) -> ContextTail {
        self.right_context_tail.clone()
    }
    #[wasm_bindgen(getter)]
    pub fn match_text(&self) -> String {
        self.match_text.clone()
    }
}

impl TextContext {
    pub fn new(note: &Note, match_position: Range, match_text: String) -> TextContext {
        TextContext {
            left_context_tail: ContextTail::new(note, &match_position, true),
            right_context_tail: ContextTail::new(note, &match_position, false),
            match_text,
        }
    }

    pub fn left_context_tail_ref(&self) -> &ContextTail {
        &self.left_context_tail
    }

    pub fn right_context_tail_ref(&self) -> &ContextTail {
        &self.right_context_tail
    }

    pub fn match_text_string(&self) -> &String {
        &self.match_text
    }

    pub fn text(&self) -> String {
        format!(
            "...{}**{}**{}...",
            &self.left_context_tail.text_string(), &self.match_text, &self.right_context_tail.text_string()
        )
    }
}
