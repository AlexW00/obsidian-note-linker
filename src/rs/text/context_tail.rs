use js_sys::JsString;
use crate::rs::text::range;
use wasm_bindgen::prelude::*;
use wasm_bindgen::{JsValue};
use crate::Note;
use crate::rs::util;

#[wasm_bindgen]
pub struct ContextTail {
    text: js_sys::JsString,
    position: range::Range,
}

impl ContextTail {
    pub(crate) const TAIL_SIZE: usize = 10;

    pub fn text(&self) -> &JsString { &self.text }
    pub fn position(&self) -> &range::Range { &self.position }

    pub fn text_string(&self) -> String {
        self.text.as_string().expect("text is not a string")
    }

    pub fn new(note: &Note, match_position: &range::Range, is_left_tail: bool) -> ContextTail {
        let position = if is_left_tail {
            range::Range::new(
                if match_position.start >= ContextTail::TAIL_SIZE * 2 {
                    match_position.start - &ContextTail::TAIL_SIZE * 2
                } else {
                    0
                },
                match_position.start,
            )
        } else {
            range::Range::new(
                match_position.end,
                if match_position.end + ContextTail::TAIL_SIZE * 2 >= note.content_string().len() {
                    note.content_string().len() - 1
                } else {
                    match_position.end + ContextTail::TAIL_SIZE * 2
                },
            )
        };
        ContextTail {
            text: ContextTail::get_context_text(
                range::Range::from(position.to_range()),
                &note.content_string()),
            position,
        }
    }

    fn get_context_text(text_position: range::Range, text: &str) -> js_sys::JsString {
        let start = util::get_nearest_char_boundary(text, text_position.start, true);
        let end = util::get_nearest_char_boundary(text, text_position.end, false);
        let string: String = text[start..end]
            .chars()
            .map(
                // replace newline with whitespace
                |c| if c == '\n' { ' ' } else { c },
            )
            .collect();
        JsString::from(string)
    }
}
