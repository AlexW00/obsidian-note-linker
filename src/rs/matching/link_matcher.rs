use std::borrow::Cow;
use std::convert::TryFrom;
use std::ops::Add;
use std::thread::Builder;
use fancy_regex::{Captures, escape, Match, Regex};
use js_sys::Error;
use crate::log;
use crate::rs::Errors::CastError::CastError;

use crate::rs::matching::link_match::LinkMatch;
use crate::rs::matching::note_matching_result::NoteMatchingResult;
use crate::rs::note::note::Note;
use crate::rs::util::range::Range;

type LinkMatcher = Regex;

pub struct RegexMatch {
    pub position: Range,
    pub matched_text: String,
    pub capture_index: usize
}


impl <'c> TryFrom<Captures <'c>> for RegexMatch {
    type Error = CastError;

    fn try_from(captures: Captures) -> Result<Self, CastError> {
        let valid = captures.iter()
            .enumerate()
            .find_map(|(i,c)| c.map(|c_| (c_, i)));

        match valid {
            Some((m, capture_index)) => {
                // TODO: Why is this always 0???
                //log(format!("got match at index {}", &capture_index).as_str());
                Ok(
                    RegexMatch {
                        position: Range::new(m.start(), m.end()),
                        matched_text: m.as_str().to_string(),
                        capture_index,
                    }
                )
            },
            _ => Err(CastError::CapturesToRegexMatch())
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
        let regex_matches: Vec<RegexMatch> = get_link_matcher(&target_note)
            .captures_iter(&note.sanitized_content())
            .filter_map( |capture_result| {
                    match capture_result {
                        Ok(captures) => RegexMatch::try_from(captures).ok(),
                        _ => None
                    }
                }
            )
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

fn concat_as_regex_string (strings: &Vec<String>) -> String {
    strings.iter()
        .enumerate()
        .fold("(".to_string(), |prev, (index, current)| {
            return if index == 0 { format!("{}{}", prev, current) } else { format!("{}|{}", prev, current) }
        })
        .add(")")
}

fn get_link_matcher(note: &Note) -> LinkMatcher {
    let mut escaped_search_strings: Vec<String> = note.aliases_vec().iter().map(|alias| escape(alias).to_string()).collect();
    let escaped_title = escape(&*note.title()).to_string();
    escaped_search_strings.push(escaped_title);

    let regex_string = concat_as_regex_string(&escaped_search_strings);
    Regex::new(&*format!(r"\b{}\b", regex_string)).unwrap()
}

pub fn get_link_matches(note_to_check: &Note, target_note_candidates: &[Note]) -> Option<NoteMatchingResult> {
    let link_matches: Vec<LinkMatch> =
        target_note_candidates
        .iter()
        .filter_map(|target_note: &Note| {
            if !&target_note.title().eq(&note_to_check.title()) {
                let link_matcher_result = LinkMatcherResult::new(
                        note_to_check,
                        target_note
                    );
                let link_matches: Vec<LinkMatch> = link_matcher_result.into();
                return Some(link_matches);
            }
            None
        })
        .flatten()
        .fold(Vec::new(), |mut merged_link_matches, link_match| {
            let index = merged_link_matches.iter()
                .position(|m: &LinkMatch| m.position().is_equal_to(&link_match.position()));
            if let Some(index) = index {
                merged_link_matches[index].merge_link_match_target_candidates(link_match.link_match_target_candidate());
            } else {
                merged_link_matches.push(link_match);
            }
            merged_link_matches
        });


    if *&!link_matches.is_empty() {
        return Some(
            NoteMatchingResult::new(
                note_to_check.clone(),
                link_matches
            )
        )
    }
    None
}