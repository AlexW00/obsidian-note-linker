use std::convert::TryFrom;
use std::ops::Add;

use fancy_regex::{escape, Regex};

use crate::rs::util::wasm_util::log;
use crate::{LinkFinderResult};
use crate::rs::matching::link_match::LinkMatch;
use crate::rs::matching::regex_match::RegexMatch;
use crate::rs::note::note::Note;

type LinkFinder = Regex;

/// A match of a link in a note.
struct LinkFinderMatchingResult<'m> {
    regex_matches: Vec<RegexMatch>,
    note: &'m Note,
    target_note: &'m Note,
}

impl<'m> LinkFinderMatchingResult<'m> {
    fn find_matches(note: &'m mut Note, target_note: &'m Note) -> Self {
        // build the regex
        let regex_matches: Vec<RegexMatch> = build_link_finder(target_note)
            // find all matches
            .captures_iter(note.get_sanitized_content())
            // map the results to a vector of RegexMatch
            .filter_map(|capture_result| {
                match capture_result {
                    Ok(captures) => {
                        RegexMatch::try_from(captures).ok()
                    }
                    _ => {
                        None
                    }
                }
            }
            )
            .collect();

        LinkFinderMatchingResult {
            regex_matches,
            note,
            target_note,
        }
    }
}

/// Creates a vec of LinkMatch from a LinkFinderMatchingResult.
impl<'m> Into<Vec<LinkMatch>> for LinkFinderMatchingResult<'m> {
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

/// Constructs a Regex string that matches any of the provided strings.
fn concat_as_regex_string(strings: &[String]) -> String {
    strings.iter()
        .enumerate()
        .fold("".to_string(), |prev, (index, current)| {
            return if index == 0 { format!("(\\b{}\\b)", current) } else { format!("{}|(\\b{}\\b)", prev, current) };
        })
        .add("")
}

/// Constructs a LinkFinder for the provided target note.
fn build_link_finder(target_note: &Note) -> LinkFinder {
    let mut escaped_search_strings: Vec<String> = target_note.aliases_vec().iter().map(|alias| escape(alias).to_string()).collect();
    let escaped_title = escape(&*target_note.title()).to_string();
    escaped_search_strings.push(escaped_title);

    let regex_string = concat_as_regex_string(&escaped_search_strings);
    //log(&format!("Regex string: {}", regex_string));
    
    Regex::new(&*format!(r"{}", regex_string)).unwrap()
}

/// Finds all link candidates in the provided note.
fn find_link_matches(target_note: &Note, note_to_check: &mut Note) -> Option<Vec<LinkMatch>> {
    if !&target_note.title().eq(&note_to_check.title()) {
        let link_finder_match = LinkFinderMatchingResult::find_matches(
            note_to_check,
            target_note,
        );
        let link_matches: Vec<LinkMatch> = link_finder_match.into();
        return Some(link_matches);
    }
    None
}

/// Merges the provided link match into the existing list of link matches.
/// If the link match is already in the list, it is merged with the existing link match.
/// If the link match is not in the list, it is added to the list.
fn merge_link_match_into_link_matches(mut merged_link_matches: Vec<LinkMatch>, link_match: LinkMatch) -> Vec<LinkMatch> {
    let index = merged_link_matches.iter()
        .position(|m: &LinkMatch| m.position().is_equal_to(&link_match.position()));

    if let Some(index) = index {
        // merge it into the existing match, if the position is the same
        merged_link_matches[index].merge_link_target_candidates(link_match);
    } else {
        // otherwise push a new match
        merged_link_matches.push(link_match);
    }
    merged_link_matches
}

/// Complete function that finds all link candidates in the provided note.
pub fn find_links(note_to_check: &mut Note, target_note_candidates: &[Note]) -> Option<LinkFinderResult> {
    let link_matches: Vec<LinkMatch> =
        target_note_candidates
            .iter()
            .filter_map(|target_note: &Note, | find_link_matches(target_note, note_to_check))
            .flatten()
            .fold(Vec::new(), merge_link_match_into_link_matches);

    if !link_matches.is_empty() {
        return Some(LinkFinderResult::new(
            note_to_check.clone(),
            link_matches,
        ));
    }

    None
}