use crate::rs::text::note::Note;
use std::ops::Range;

struct ContextTail {
    text: String,
    position: Range<usize>,
}

pub struct TextContext {
    left_context_tail: ContextTail,
    right_context_tail: ContextTail,
    match_text: String,
}

impl TextContext {
    const CONTEXT_SIZE: usize = 20;

    pub fn new(note: &Note, match_position: Range<usize>, match_text: String) -> TextContext {
        let context_tails = TextContext::get_context_tails(note, &match_position);
        TextContext {
            left_context_tail: context_tails.0,
            right_context_tail: context_tails.1,
            match_text,
        }
    }

    fn get_context_tails(note: &Note, match_position: &Range<usize>) -> (ContextTail, ContextTail) {
        let left_tail_end = match_position.start;
        let left_tail_start = if match_position.start >= TextContext::CONTEXT_SIZE {
            match_position.start - &TextContext::CONTEXT_SIZE
        } else {
            0
        };

        let right_tail_start = match_position.end;
        let right_tail_end =
            if match_position.end + TextContext::CONTEXT_SIZE >= note.content().len() {
                note.content().len() - 1
            } else {
                match_position.end + TextContext::CONTEXT_SIZE
            };

        (
            ContextTail {
                text: TextContext::get_context_text(left_tail_start..left_tail_end, note.content()),
                position: left_tail_start..left_tail_end,
            },
            ContextTail {
                text: TextContext::get_context_text(
                    right_tail_start..right_tail_end,
                    &note.content(),
                ),
                position: right_tail_start..right_tail_end,
            },
        )
    }

    fn get_context_text(text_position: Range<usize>, text: &str) -> String {
        let start = TextContext::get_nearest_char_boundary(text, text_position.start, true);
        let end = TextContext::get_nearest_char_boundary(text, text_position.end, false);
        text[start..end]
            .chars()
            .map(
                // replace newline with whitespace
                |c| if c == '\n' { ' ' } else { c },
            )
            .collect()
    }

    /// returns the nearest char boundary that is not an emoji
    fn get_nearest_char_boundary(text: &str, position: usize, do_expand_left: bool) -> usize {
        let mut i = position;
        let mut direction = do_expand_left;
        while i > 0 && !text.is_char_boundary(i) {
            if text.len() == i || i == 0 {
                direction = !direction;
            }
            if direction {
                i -= 1;
            } else {
                i += 1;
            }
        }
        i
    }

    pub fn text(&self) -> String {
        format!(
            "...{}**{}**{}...",
            &self.left_context_tail.text, &self.match_text, &self.right_context_tail.text
        )
    }
}
