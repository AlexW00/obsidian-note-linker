use wasm_bindgen::prelude::*;

use crate::rs::note::note::Note;
use crate::rs::text::text_util::get_nearest_char_boundary;
use crate::rs::util::range;

#[wasm_bindgen]
#[derive(Clone)]
pub struct TextContextTail {
    text: String,
    position: range::Range,
}

#[wasm_bindgen]
impl TextContextTail {
    #[wasm_bindgen(getter)]
    pub fn text(&self) -> String { self.text.clone() }
    #[wasm_bindgen(getter)]
    pub fn position(&self) -> range::Range { self.position.clone() }
}

impl TextContextTail {
    pub(crate) const TAIL_SIZE: usize = 10;

    pub fn new(note: &Note, match_position: &range::Range, is_left_tail: bool) -> TextContextTail {
        let position = if is_left_tail {
            range::Range::new(
                if match_position.start() >= TextContextTail::TAIL_SIZE * 2 {
                    match_position.start() - &TextContextTail::TAIL_SIZE * 2
                } else {
                    0
                },
                match_position.start(),
            )
        } else {
            range::Range::new(
                match_position.end(),
                if match_position.end() + TextContextTail::TAIL_SIZE * 2 >= note.content().len() {
                    note.content().len() - 1
                } else {
                    match_position.end() + TextContextTail::TAIL_SIZE * 2
                },
            )
        };
        TextContextTail {
            text: TextContextTail::get_context_text(
                position.clone(),
                &note.content()),
            position,
        }
    }

    fn get_context_text(text_position: range::Range, text: &str) -> String {
        let start = get_nearest_char_boundary(text, text_position.start(), true);
        let end = get_nearest_char_boundary(text, text_position.end(), false);
        text[start..end]
            .chars()
            .map(
                // replace newline with whitespace
                |c| if c == '\n' { ' ' } else { c },
            )
            .collect()
    }
}
