use std::convert::TryFrom;
use fancy_regex::{escape, Regex};
use crate::rs::text::range::{Range, RangeArray};
use crate::rs::text::note::{Note, StringArray};
use crate::rs::text::note_match::NoteMatch;
use crate::rs::text::text_util::create_string_with_n_characters;
use js_sys::{Array, Object};
use wasm_bindgen::{JsCast, JsValue};


pub struct RsNote {
    pub title: String,
    pub path: String,
    pub content: String,
    pub aliases: Vec<String>,
    pub ignore: Vec<Range>,
}

impl RsNote {
    pub fn new(title: String, path: String, content: String, aliases: Vec<String>, ignore: Vec<Range>) -> RsNote {
        RsNote {
            title,
            path,
            content,
            aliases,
            ignore,
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

    pub fn ignore(&self) -> &Vec<Range> {
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

impl From<Note> for RsNote {
    fn from(note: Note) -> Self {
        RsNote {
            title: note.title().as_string().unwrap(),
            path: note.path().as_string().unwrap(),
            content: note.content().as_string().unwrap(),
            aliases: {
                let arr: Result<Array, StringArray> = note.aliases().dyn_into::<Array>();
                match arr {
                    Ok(arr) => arr.iter()
                        .filter_map(|a: JsValue| a.as_string())
                        .collect(),
                    Err(_) => vec![],
                }

            },
            ignore: {
                let arr : Result<Array, RangeArray>= note.ignore().dyn_into::<Array>();
                match arr {
                    Ok(arr) => {
                        arr.iter()
                            .filter_map(|js_val_range: JsValue| Range::try_from(js_val_range).ok())
                            .collect()
                    },
                    Err(_) => vec![]
                }
            },
        }
    }
}