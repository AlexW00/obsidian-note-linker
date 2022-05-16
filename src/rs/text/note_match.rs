use crate::rs::text::text_context::TextContext;
use std::ops::Range;
use crate::rs::text::rs_note::RsNote;

pub struct NoteMatch<'n> {
    pub note: &'n RsNote,
    pub position: Range<usize>,
    pub matched_text: String,
    pub context: TextContext,
}

impl<'n> NoteMatch<'n> {
    pub fn new(note: &'n RsNote, position: Range<usize>, matched_text: &String) -> Self {
        NoteMatch {
            note,
            position: position.clone(),
            matched_text: matched_text.clone(),
            context: TextContext::new(note, position.clone(), matched_text.clone()),
        }
    }

    /// Prints all the important info in one line
    pub fn print(&self) {
        println!(
            "Match [{}] (context: {}) at position: {}-{}, in note: {}",
            self.matched_text,
            self.context.text(),
            self.position.start,
            self.position.end,
            self.note.title()
        );
    }
}
