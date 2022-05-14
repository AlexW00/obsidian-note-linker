use crate::rs::text::note::Note;
use crate::rs::text::text_context::TextContext;
use std::ops::Range;

pub struct NoteMatch<'n> {
    pub note: &'n Note,
    pub position: Range<usize>,
    pub matched_text: String,
    pub context: TextContext,
}

impl<'n> NoteMatch<'n> {
    pub fn new(note: &'n Note, position: Range<usize>, matched_text: &String) -> Self {
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
            self.note.name()
        );
    }
}
