use fancy_regex::{Match, Matches, Regex};
use crate::{Note, LinkMatch, NoteMatchResult};
use crate::rs::text::link_match_target::{LinkTarget, LinkTargetArray};

type LinkMatcher = Regex;

struct LinkMatcherResult <'m> {
    regex_matches: Matches<'m, 'm>,
    note: &'m Note,
    target_note: &'m Note,
}

impl <'m> LinkMatcherResult <'m> {
    fn new(regex_matches: Matches<'m, 'm>, note: &'m Note, target_note:  &'m Note) -> Self {
        LinkMatcherResult {
            regex_matches,
            note,
            target_note,
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
    let target_note = link_matcher_result.target_note;
    let link_target = LinkTarget::new_from_note(target_note);
    let link_target_array = LinkTargetArray::from(vec![link_target]);
    matches.iter().map(|m|
        LinkMatch::new_from_match(m, note, &link_target_array)
    )
        .collect()
}

pub fn search_note_for_links(note_to_check: &Note, notes: &[Note]) -> NoteMatchResult {
    let link_matches : Vec<LinkMatch> = notes
        .iter()
        .filter_map(|note: &Note| {
            if !&note.title_string().eq(note_to_check.title_string()) {
                let link_matcher = get_link_matcher(note);
                let link_matcher_result = LinkMatcherResult::new(
                    link_matcher.find_iter(note_to_check.content_string()),
                    note_to_check,
                    note
                );
                let note_matches = handle_link_matcher_result(link_matcher_result);
                Some(note_matches)
            } else { None }
        })
        .flatten()
        .collect();
    NoteMatchResult::new(note_to_check, link_matches)
}