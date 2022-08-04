use wasm_bindgen::prelude::*;

use crate::rs::note::note::Note;
use crate::rs::text::text_context_tail::TextContextTail;
use crate::rs::util::range::Range;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize)]
pub struct TextContext {
    left_context_tail: TextContextTail,
    right_context_tail: TextContextTail,
    match_text: String,
}

#[wasm_bindgen]
impl TextContext {
    #[wasm_bindgen(getter, js_name = "leftContextTail")]
    pub fn left_context_tail(&self) -> TextContextTail {
        self.left_context_tail.clone()
    }
    #[wasm_bindgen(getter, js_name = "rightContextTail")]
    pub fn right_context_tail(&self) -> TextContextTail {
        self.right_context_tail.clone()
    }
    #[wasm_bindgen(getter, js_name = "matchText")]
    pub fn match_text(&self) -> String {
        self.match_text.clone()
    }
}

impl TextContext {
    pub fn new(note: &Note, match_position: Range, match_text: String) -> TextContext {
        TextContext {
            left_context_tail: TextContextTail::new(note, &match_position, true),
            right_context_tail: TextContextTail::new(note, &match_position, false),
            match_text,
        }
    }
}
