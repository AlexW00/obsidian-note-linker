use js_sys::JsString;
use wasm_bindgen::prelude::*;

use crate::rs::note::note::Note;
use crate::rs::text::text_util::get_nearest_char_boundary;
use crate::rs::util::range;

#[wasm_bindgen]
#[derive(Clone)]
pub struct TextContextTail {
    text: JsString,
    position: range::Range,

    _text: String,
}

#[wasm_bindgen]
impl TextContextTail {
    #[wasm_bindgen(getter)]
    pub fn text(&self) -> JsString { self.text.clone() }
    #[wasm_bindgen(getter)]
    pub fn position(&self) -> range::Range { self.position.clone() }
}

impl TextContextTail {
    pub(crate) const TAIL_SIZE: usize = 10;

    pub fn text_string(&self) -> &String {
        &self._text
    }

    pub fn new(note: &Note, match_position: &range::Range, is_left_tail: bool) -> TextContextTail {
        let position = if is_left_tail {
            range::Range::new_with_usize(
                if match_position.start_usize() >= TextContextTail::TAIL_SIZE * 2 {
                    match_position.start_usize() - &TextContextTail::TAIL_SIZE * 2
                } else {
                    0
                },
                match_position.start_usize(),
            )
        } else {
            range::Range::new_with_usize(
                match_position.end_usize(),
                if match_position.end_usize() + TextContextTail::TAIL_SIZE * 2 >= note.content_string().len() {
                    note.content_string().len() - 1
                } else {
                    match_position.end_usize() + TextContextTail::TAIL_SIZE * 2
                },
            )
        };
        TextContextTail {
            text: TextContextTail::get_context_text(
                range::Range::from(position.to_range()),
                &note.content_string()),
            position,
            _text: note.content_string().to_string(),
        }
    }

    fn get_context_text(text_position: range::Range, text: &str) -> JsString {
        let start = get_nearest_char_boundary(text, text_position.start_usize(), true);
        let end = get_nearest_char_boundary(text, text_position.end_usize(), false);
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
