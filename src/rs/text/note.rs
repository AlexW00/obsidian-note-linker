use crate::rs::text::note_match::NoteMatch;
use crate::rs::text::text_util::{
    check_if_dir_exists, combine_regular_expressions, create_string_with_n_characters,
    get_file_content, is_markdown_file, trim_file_extension,
};
use fancy_regex::{escape, Captures, Regex};
use std::path::Path;

/// A note is a file with a md extension.
/// It has a filename (without md extension), a path, and a content.
pub struct Note {
    path: Box<Path>,
    name: String,
    content: String,
}

fn build_sanitizer_regex() -> Regex {
    let internal_link_pattern = r"\[\[.*?]]";
    let external_link_pattern = r"\[([^]]*)]\(([^)]*)\)";
    let code_block_pattern = r"\`\`\`.+?\`\`\`";
    let code_inline_pattern = r"\`.*?\`";
    let patterns = [
        internal_link_pattern,
        external_link_pattern,
        code_block_pattern,
        code_inline_pattern,
    ];
    combine_regular_expressions(patterns)
}
/// Implementation of the Note struct
impl Note {
    pub fn new(path: Box<Path>, name: String, content: String) -> Note {
        Note {
            path,
            name,
            content,
        }
    }

    pub fn path(&self) -> &Path {
        &self.path
    }
    pub fn name(&self) -> &str {
        &self.name
    }
    pub fn content(&self) -> &str {
        &self.content
    }

    fn sanitized_content(&self) -> String {
        //return self.content.clone();
        build_sanitizer_regex()
            .replace_all(self.content(), |caps: &Captures| {
                let first_group = caps.get(1).unwrap();
                let len = first_group.as_str().len();
                create_string_with_n_characters(len, ' ')
            })
            .to_string()
    }

    pub fn search_note_for_links(&self, notes: &Vec<Note>) {
        for note in notes {
            if !note.name().eq(self.name()) {
                let escaped_name = escape(note.name());
                let re = Regex::new(&*format!(r"\b{}\b", escaped_name)).unwrap();
                let sanitized_content = self.sanitized_content();
                let matches = re.find_iter(&sanitized_content);
                for m_r in matches {
                    if let Ok(match_result) = m_r {
                        let position = match_result.start()..match_result.end();
                        let note_match =
                            NoteMatch::new(self, position, &match_result.as_str().to_string());
                        note_match.print();
                    }
                }
            };
        }
    }
}


