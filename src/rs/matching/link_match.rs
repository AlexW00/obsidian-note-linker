use js_sys::{Array};
use wasm_bindgen::prelude::*;
use crate::log;

use crate::rs::matching::link_match_target_candidate::LinkTargetCandidate;
use crate::rs::matching::link_matcher::RegexMatch;
use crate::rs::note::note::Note;
use crate::rs::text::text_context::TextContext;
use crate::rs::util::range::Range;
use crate::rs::util::SelectionItem::SelectionItem;
use crate::rs::util::wasm_util::generic_of_jsval;

/// A text passage, that has been identified as a possible matching
#[wasm_bindgen]
pub struct LinkMatch {
    position: Range,
    matched_text: String,
    context: TextContext,
    link_match_target_candidates: Array
}

#[wasm_bindgen]
impl LinkMatch {
    #[wasm_bindgen(getter)]
    pub fn position(&self) -> Range { self.position.clone() }
    #[wasm_bindgen(getter)]
    pub fn matched_text(&self) -> String { self.matched_text.clone() }
    #[wasm_bindgen(getter)]
    pub fn context(&self) -> TextContext { self.context.clone() }
    #[wasm_bindgen(getter)]
    // TODO: Rename
    pub fn link_match_target_candidate(&self) -> Array { self.link_match_target_candidates.clone() }
}

impl LinkMatch {
    pub fn new(position: Range, matched_text: String, context: TextContext, link_target_candidates_vec: Vec<LinkTargetCandidate>) -> Self {
        let link_target_candidates: Array = js_sys::Array::new();
        for link_target in link_target_candidates_vec {
                link_target_candidates.push(&link_target.into());
        }
        LinkMatch {
            position,
            matched_text,
            context,
            link_match_target_candidates: link_target_candidates
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

    pub fn merge_link_match_target_candidates (&mut self, mut link_match: LinkMatch) {
        link_match.link_match_target_candidates.iter().for_each(|js_candidate: JsValue| {
            // uncheck all candidates
            let mut candidate : LinkTargetCandidate = generic_of_jsval(js_candidate, "LinkTargetCandidate").unwrap();
            candidate.de_select_all();
            let js: JsValue = candidate.into();
            self.link_match_target_candidates.push(&js);
        });
    }
}