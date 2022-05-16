use fancy_regex::{escape, Regex};
use crate::rs::text::js_note::{JsNote, ToRsNote};
use crate::rs::text::note_match::NoteMatch;
use crate::rs::text::rs_range::RsRange;
use crate::rs::text::text_util::create_string_with_n_characters;

pub struct RsNote {
    title: String,
    path: String,
    content: String,
    aliases: Vec<String>,
    ignore: Vec<RsRange>,
}

impl RsNote {
    pub(crate) fn new (js_note: &JsNote) -> Self {
        RsNote {
            title: js_note.title(),
            path: js_note.path(),
            content: js_note.content(),
            aliases: js_note.aliases(),
            ignore: js_note.ignore(),
        }
    }

    pub fn title(&self) -> &str {
        &self.title
    }

    pub fn path(&self) -> &str {
        &self.path
    }

    pub fn content(&self) -> &str {
        &self.content
    }

    pub fn aliases(&self) -> &Vec<String> {
        &self.aliases
    }

    pub fn ignore(&self) -> &Vec<RsRange> {
        &self.ignore
    }

    pub fn search_note_for_links(&self, notes: &Vec<RsNote>) {
        for note in notes {
            if !note.title.eq(&self.title) {
                let escaped_name = escape(&note.title);
                let re = Regex::new(&*format!(r"\b{}\b", escaped_name)).unwrap();
                let sanitized_content = self.sanitized_content();
                let match_results = re.find_iter(&sanitized_content);
                for m in match_results {
                    if let Ok(match_result) = m {
                        let position = match_result.start()..match_result.end();
                        let note_match =
                            NoteMatch::new(self, position, &match_result.as_str().to_string());
                        note_match.print();
                    }
                }
            };
        }
    }

    fn sanitized_content(&self) -> String {
        let mut sanitized_content = self.content.clone();
        for ignore in &self.ignore {
            let range = ignore.to_range();
            let replacement = &*create_string_with_n_characters(range.len(), ' ');
            sanitized_content.replace_range(range, replacement);
        }
        sanitized_content
    }
}