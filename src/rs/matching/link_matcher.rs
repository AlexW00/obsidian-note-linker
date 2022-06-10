use fancy_regex::{Match, Regex};

use crate::rs::matching::link_match::LinkMatch;
use crate::rs::matching::link_matching_result::LinkMatchingResult;
use crate::rs::note::note::Note;
use crate::rs::util::range::Range;

type LinkMatcher = Regex;

pub struct RegexMatch {
    pub position: Range,
    pub matched_text: String
}

impl RegexMatch {
    pub fn new_from_match (m: Match) -> Self {
        RegexMatch {
            position: Range::new_with_usize(m.start(), m.end()),
            matched_text: m.as_str().to_string()
        }
    }
}

struct LinkMatcherResult <'m> {
    regex_matches: Vec<RegexMatch>,
    note: &'m Note,
    target_note: &'m Note,
}

impl <'m> LinkMatcherResult <'m> {
    fn new(note: &'m Note, target_note: &'m Note) -> Self {
        let regex_matches: Vec<RegexMatch> = get_link_matcher(note.title_string())
            .find_iter(&note.content_string())
            .filter_map(|match_result| { match_result.ok() })
            .map(|m: Match| RegexMatch::new_from_match(m))
            .collect();

        LinkMatcherResult {
            regex_matches,
            note,
            target_note,
        }
    }

    /*fn has_matches(&self) -> bool {
        &self.regex_matches.count() > &0
    }*/
}

impl <'m> Into<Vec<LinkMatch>> for LinkMatcherResult <'m> {
    fn into(self) -> Vec<LinkMatch> {
        let note: &Note = self.note;
        let target_note: &Note = self.target_note;
        let text_link_matches: Vec<LinkMatch> = self.regex_matches
            .into_iter()
            .map(|regex_match: RegexMatch| {
                LinkMatch::new_from_match(&regex_match, note, target_note)
            })
            .collect();
        text_link_matches
    }
}

fn get_link_matcher(title_string: &String) -> LinkMatcher {
    let escaped_name = fancy_regex::escape(title_string);
    Regex::new(&*format!(r"\b{}\b", escaped_name)).unwrap()
}

pub fn get_link_matches(note_to_check: &Note, target_note_candidates: &[Note]) -> Option<LinkMatchingResult> {
    let text_link_matches: Vec<LinkMatch> =
        target_note_candidates
        .iter()
        .filter_map(|target_note: &Note| {
            if !&target_note.title_string().eq(note_to_check.title_string()) {
                return Some(
                    LinkMatcherResult::new(
                        note_to_check,
                        target_note
                    )
                )
            }
            None
        })
        .map(
            |link_matcher_result: LinkMatcherResult| {
                // TODO: is there a mapping function for casting?
                let text_link_match: Vec<LinkMatch> = link_matcher_result.into();
                text_link_match
            }
        )
        .flatten()
        .collect();
    if *&!text_link_matches.is_empty() {
        return Some(
            LinkMatchingResult::new(
                note_to_check.clone(),
                text_link_matches
            )
        )
    }
    None
}