use std::convert::TryFrom;
use std::ops::Add;

use fancy_regex::{escape, Regex};

use crate::{LinkFinderResult};
use crate::rs::matching::link_match::LinkMatch;
use crate::rs::matching::regex_match::RegexMatch;
use crate::rs::note::note::Note;

type LinkFinder = Regex;

struct LinkFinderMatch<'m> {
    regex_matches: Vec<RegexMatch>,
    note: &'m Note,
    target_note: &'m Note,
}

impl<'m> LinkFinderMatch<'m> {
    fn new(note: &'m mut Note, target_note: &'m Note) -> Self {
        let regex_matches: Vec<RegexMatch> = build_link_finder(target_note)
            .captures_iter(note.get_sanitized_content())
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

        LinkFinderMatch {
            regex_matches,
            note,
            target_note,
        }
    }
}

impl<'m> Into<Vec<LinkMatch>> for LinkFinderMatch<'m> {
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

fn concat_as_regex_string(strings: &[String]) -> String {
    strings.iter()
        .enumerate()
        .fold("(".to_string(), |prev, (index, current)| {
            return if index == 0 { format!("{}{}", prev, current) } else { format!("{}|{}", prev, current) };
        })
        .add(")")
}

fn build_link_finder(note: &Note) -> LinkFinder {
    let mut escaped_search_strings: Vec<String> = note.aliases_vec().iter().map(|alias| escape(alias).to_string()).collect();
    let escaped_title = escape(&*note.title()).to_string();
    escaped_search_strings.push(escaped_title);

    let regex_string = concat_as_regex_string(&escaped_search_strings);
    Regex::new(&*format!(r"\b{}\b", regex_string)).unwrap()
}

fn find_link_matches(target_note: &Note, note_to_check: &mut Note) -> Option<Vec<LinkMatch>> {
    if !&target_note.title().eq(&note_to_check.title()) {
        let link_finder_match = LinkFinderMatch::new(
            note_to_check,
            target_note,
        );
        let link_matches: Vec<LinkMatch> = link_finder_match.into();
        return Some(link_matches);
    }
    None
}

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