use fancy_regex::{Match, Matches, Regex};
use crate::{Note, LinkMatch};
use crate::rs::text::range::Range;

type LinkMatcher = Regex;

struct LinkMatcherResult <'m> {
    regex_matches: Matches<'m, 'm>,
    note: &'m Note
}

impl <'m> LinkMatcherResult <'m> {
    fn new(regex_matches: Matches<'m, 'm>, note: &'m Note) -> Self {
        LinkMatcherResult {
            regex_matches,
            note
        }
    }
}

fn get_link_matcher(note: &Note) -> LinkMatcher {
    let escaped_name = fancy_regex::escape(note.title_string());
    fancy_regex::Regex::new(&*format!(r"\b{}\b", escaped_name)).unwrap()
}


fn handle_link_matcher_result (link_matcher_result: LinkMatcherResult) -> Vec<LinkMatch> {
    let matches: Vec<Match> = link_matcher_result.regex_matches.filter_map(|m| m.ok()).collect();
    let note = link_matcher_result.note;
    matches.iter().map(|m| build_link_match_from_match(m, note))
        .collect()
}

fn build_link_match_from_match <'m> (match_: &Match<'m>, note: &Note) -> LinkMatch {
    let matched_text = match_.as_str();
    let position = Range::new_with_usize(match_.start(), match_.end());
    LinkMatch::new(note, position, js_sys::JsString::from(matched_text))
}

pub fn search_note_for_links(note_to_check: &Note, notes: &[Note]) -> Vec<LinkMatch> {
    notes
        .iter()
        .filter_map(|note: &Note| {
            if !&note.title_string().eq(note_to_check.title_string()) {
                let link_matcher = get_link_matcher(note);
                let link_matcher_result = LinkMatcherResult::new(link_matcher.find_iter(note.content_string()), note);
                let note_matches = handle_link_matcher_result(link_matcher_result);
                Some(note_matches)
            } else { None }
        })
        .flatten()
        .collect()
}