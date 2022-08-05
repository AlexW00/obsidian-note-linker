use js_sys::{Array};
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

use crate::rs::matching::link_target_candidate::{link_target_candidate_vec_into_array, LinkTargetCandidate};
use crate::rs::matching::regex_match::RegexMatch;
use crate::rs::note::note::Note;
use crate::rs::text::text_context::TextContext;
use crate::rs::util::range::Range;

/// A text passage, that has been identified as a possible link.
#[wasm_bindgen]
#[derive(Clone, Serialize, Deserialize)]
pub struct LinkMatch {
    position: Range, // the position of the match in the text
    matched_text: String, // the text that was matched
    context: TextContext, // the context of the match (the text before and after the match)

    #[serde(rename = "linkTargetCandidates")]
    _link_target_candidates: Vec<LinkTargetCandidate> // the link target candidates for the match
}

#[wasm_bindgen]
impl LinkMatch {
    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Range { self.position.clone() }

    #[wasm_bindgen(getter, js_name = "matchedText")]
    pub fn matched_text(&self) -> String { self.matched_text.clone() }

    #[wasm_bindgen(getter)]
    pub fn context(&self) -> TextContext { self.context.clone() }

    #[wasm_bindgen(getter, js_name = "linkTargetCandidates")]
    pub fn link_target_candidates(&self) -> Array {
        link_target_candidate_vec_into_array(self._link_target_candidates.clone())
    }
}

impl LinkMatch {
    pub fn new(position: Range, matched_text: String, context: TextContext, _link_target_candidates: Vec<LinkTargetCandidate>) -> Self {
        LinkMatch {
            position,
            matched_text,
            context,
            _link_target_candidates
        }
    }

    pub fn new_from_match(regex_match: &RegexMatch, note: &Note, target_note: &Note) -> Self {
        let link_target_candidates: Vec<LinkTargetCandidate> = vec![LinkTargetCandidate::new(
          target_note.title(),
          target_note.path(),
          target_note.aliases_vec(),
            regex_match.capture_index
        )];
        Self::new(
            regex_match.position.clone(),
            regex_match.matched_text.clone(),
            TextContext::new(note, regex_match.position.clone(), regex_match.matched_text.clone()),
            link_target_candidates
        )
    }

    /// Merges this LinkMatch with another LinkMatch. by combining their link target candidates.
    pub fn merge_link_target_candidates(&mut self, link_match: LinkMatch) {
        for mut candidate in link_match._link_target_candidates {
            // uncheck all candidates
            candidate.un_prefer_all();
            self._link_target_candidates.push(candidate);
        }
    }
}

pub fn link_match_vec_into_array(link_matches: Vec<LinkMatch>) -> Array {
    let link_matches_array = Array::new();
    for link_match in link_matches {
        link_matches_array.push(&link_match.into());
    }
    link_matches_array
}